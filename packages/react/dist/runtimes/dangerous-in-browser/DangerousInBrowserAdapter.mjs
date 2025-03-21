// src/runtimes/dangerous-in-browser/DangerousInBrowserAdapter.ts
import { toCoreMessages } from "../edge/converters/toCoreMessages.mjs";
import { toLanguageModelTools } from "../edge/converters/toLanguageModelTools.mjs";
import { runResultStream } from "../edge/streams/runResultStream.mjs";
import { toolResultStream } from "../edge/streams/toolResultStream.mjs";
import { asAsyncIterable } from "../edge/EdgeChatAdapter.mjs";
import {
  getEdgeRuntimeStream
} from "../edge/createEdgeRuntimeAPI.mjs";
var DangerousInBrowserAdapter = class {
  constructor(options) {
    this.options = options;
  }
  async *run({ messages, abortSignal, context }) {
    const res = await getEdgeRuntimeStream({
      options: this.options,
      abortSignal,
      requestData: {
        system: context.system,
        messages: toCoreMessages(messages),
        tools: context.tools ? toLanguageModelTools(context.tools) : [],
        ...context.callSettings,
        ...context.config
      }
    });
    const stream = res.pipeThrough(toolResultStream(context.tools, abortSignal)).pipeThrough(runResultStream());
    for await (const update of asAsyncIterable(stream)) {
      yield update;
    }
  }
};
export {
  DangerousInBrowserAdapter
};
//# sourceMappingURL=DangerousInBrowserAdapter.mjs.map