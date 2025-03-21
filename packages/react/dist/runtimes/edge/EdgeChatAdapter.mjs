// src/runtimes/edge/EdgeChatAdapter.ts
import { toCoreMessages } from "./converters/toCoreMessages.mjs";
import { toLanguageModelTools } from "./converters/toLanguageModelTools.mjs";
import { assistantDecoderStream } from "./streams/assistantDecoderStream.mjs";
import { streamPartDecoderStream } from "./streams/utils/streamPartDecoderStream.mjs";
import { runResultStream } from "./streams/runResultStream.mjs";
import { toolResultStream } from "./streams/toolResultStream.mjs";
import { toLanguageModelMessages } from "./converters/index.mjs";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
function asAsyncIterable(source) {
  return {
    [Symbol.asyncIterator]: () => {
      const reader = source.getReader();
      return {
        async next() {
          const { done, value } = await reader.read();
          return done ? { done: true, value: void 0 } : { done: false, value };
        }
      };
    }
  };
}
var toAISDKTools = (tools) => {
  return Object.fromEntries(
    Object.entries(tools).map(([name, tool]) => [
      name,
      {
        ...tool.description ? { description: tool.description } : void 0,
        parameters: tool.parameters instanceof z.ZodType ? zodToJsonSchema(tool.parameters) : tool.parameters
      }
    ])
  );
};
var EdgeChatAdapter = class {
  constructor(options) {
    this.options = options;
  }
  async *run({
    messages,
    runConfig,
    abortSignal,
    context,
    unstable_assistantMessageId,
    unstable_getMessage
  }) {
    const headersValue = typeof this.options.headers === "function" ? await this.options.headers() : this.options.headers;
    const headers = new Headers(headersValue);
    headers.set("Content-Type", "application/json");
    const result = await fetch(this.options.api, {
      method: "POST",
      headers,
      credentials: this.options.credentials ?? "same-origin",
      body: JSON.stringify({
        system: context.system,
        messages: this.options.unstable_AISDKInterop ? toLanguageModelMessages(messages, {
          unstable_includeId: this.options.unstable_sendMessageIds || this.options.sendExtraMessageFields
        }) : toCoreMessages(messages, {
          unstable_includeId: this.options.unstable_sendMessageIds || this.options.sendExtraMessageFields
        }),
        tools: context.tools ? this.options.unstable_AISDKInterop === "v2" ? toAISDKTools(context.tools) : toLanguageModelTools(context.tools) : [],
        unstable_assistantMessageId,
        runConfig,
        ...context.callSettings,
        ...context.config,
        ...this.options.body
      }),
      signal: abortSignal
    });
    await this.options.onResponse?.(result);
    try {
      if (!result.ok) {
        throw new Error(`Status ${result.status}: ${await result.text()}`);
      }
      const stream = result.body.pipeThrough(streamPartDecoderStream()).pipeThrough(assistantDecoderStream()).pipeThrough(toolResultStream(context.tools, abortSignal)).pipeThrough(runResultStream());
      let update;
      for await (update of asAsyncIterable(stream)) {
        yield update;
      }
      if (update === void 0)
        throw new Error("No data received from Edge Runtime");
      this.options.onFinish?.(unstable_getMessage());
    } catch (error) {
      this.options.onError?.(error);
      throw error;
    }
  }
};
export {
  EdgeChatAdapter,
  asAsyncIterable
};
//# sourceMappingURL=EdgeChatAdapter.mjs.map