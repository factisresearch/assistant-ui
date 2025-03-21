"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/runtimes/edge/EdgeChatAdapter.ts
var EdgeChatAdapter_exports = {};
__export(EdgeChatAdapter_exports, {
  EdgeChatAdapter: () => EdgeChatAdapter,
  asAsyncIterable: () => asAsyncIterable
});
module.exports = __toCommonJS(EdgeChatAdapter_exports);
var import_toCoreMessages = require("./converters/toCoreMessages.js");
var import_toLanguageModelTools = require("./converters/toLanguageModelTools.js");
var import_assistantDecoderStream = require("./streams/assistantDecoderStream.js");
var import_streamPartDecoderStream = require("./streams/utils/streamPartDecoderStream.js");
var import_runResultStream = require("./streams/runResultStream.js");
var import_toolResultStream = require("./streams/toolResultStream.js");
var import_converters = require("./converters/index.js");
var import_zod = require("zod");
var import_zod_to_json_schema = __toESM(require("zod-to-json-schema"));
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
        parameters: tool.parameters instanceof import_zod.z.ZodType ? (0, import_zod_to_json_schema.default)(tool.parameters) : tool.parameters
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
        messages: this.options.unstable_AISDKInterop ? (0, import_converters.toLanguageModelMessages)(messages, {
          unstable_includeId: this.options.unstable_sendMessageIds || this.options.sendExtraMessageFields
        }) : (0, import_toCoreMessages.toCoreMessages)(messages, {
          unstable_includeId: this.options.unstable_sendMessageIds || this.options.sendExtraMessageFields
        }),
        tools: context.tools ? this.options.unstable_AISDKInterop === "v2" ? toAISDKTools(context.tools) : (0, import_toLanguageModelTools.toLanguageModelTools)(context.tools) : [],
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
      const stream = result.body.pipeThrough((0, import_streamPartDecoderStream.streamPartDecoderStream)()).pipeThrough((0, import_assistantDecoderStream.assistantDecoderStream)()).pipeThrough((0, import_toolResultStream.toolResultStream)(context.tools, abortSignal)).pipeThrough((0, import_runResultStream.runResultStream)());
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EdgeChatAdapter,
  asAsyncIterable
});
//# sourceMappingURL=EdgeChatAdapter.js.map