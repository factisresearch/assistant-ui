"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ai-sdk.ts
var ai_sdk_exports = {};
__export(ai_sdk_exports, {
  LanguageModelV1StreamDecoder: () => LanguageModelV1StreamDecoder,
  fromStreamObject: () => fromStreamObject,
  fromStreamText: () => fromStreamText
});
module.exports = __toCommonJS(ai_sdk_exports);

// src/core/utils/stream/merge.ts
var promiseWithResolvers = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
var createMergeStream = () => {
  const list = [];
  let sealed = false;
  let controller;
  let currentPull;
  const handlePull = (item) => {
    if (!item.promise) {
      item.promise = item.reader.read().then(({ done, value }) => {
        item.promise = void 0;
        if (done) {
          list.splice(list.indexOf(item), 1);
          if (sealed && list.length === 0) {
            controller.close();
          }
        } else {
          controller.enqueue(value);
        }
        currentPull?.resolve();
        currentPull = void 0;
      }).catch((e) => {
        console.error(e);
        list.forEach((item2) => {
          item2.reader.cancel();
        });
        list.length = 0;
        controller.error(e);
        currentPull?.reject(e);
        currentPull = void 0;
      });
    }
  };
  const readable = new ReadableStream({
    start(c) {
      controller = c;
    },
    pull() {
      currentPull = promiseWithResolvers();
      list.forEach((item) => {
        handlePull(item);
      });
      return currentPull.promise;
    },
    cancel() {
      list.forEach((item) => {
        item.reader.cancel();
      });
      list.length = 0;
    }
  });
  return {
    readable,
    isSealed() {
      return sealed;
    },
    seal() {
      sealed = true;
      if (list.length === 0) controller.close();
    },
    addStream(stream) {
      if (sealed)
        throw new Error(
          "Cannot add streams after the run callback has settled."
        );
      const item = { reader: stream.getReader() };
      list.push(item);
      handlePull(item);
    },
    enqueue(chunk) {
      this.addStream(
        new ReadableStream({
          start(c) {
            c.enqueue(chunk);
            c.close();
          }
        })
      );
    }
  };
};

// src/core/modules/text.ts
var TextStreamControllerImpl = class {
  _controller;
  _isClosed = false;
  constructor(controller) {
    this._controller = controller;
  }
  append(textDelta) {
    this._controller.enqueue({
      type: "text-delta",
      path: [],
      textDelta
    });
    return this;
  }
  close() {
    if (this._isClosed) return;
    this._isClosed = true;
    this._controller.enqueue({
      type: "part-finish",
      path: []
    });
    this._controller.close();
  }
};
var createTextStream = (readable) => {
  return new ReadableStream({
    start(c) {
      return readable.start?.(new TextStreamControllerImpl(c));
    },
    pull(c) {
      return readable.pull?.(new TextStreamControllerImpl(c));
    },
    cancel(c) {
      return readable.cancel?.(c);
    }
  });
};
var createTextStreamController = () => {
  let controller;
  const stream = createTextStream({
    start(c) {
      controller = c;
    }
  });
  return [stream, controller];
};

// src/core/modules/tool-call.ts
var ToolCallStreamControllerImpl = class {
  constructor(_controller) {
    this._controller = _controller;
    const stream = createTextStream({
      start: (c) => {
        this._argsTextController = c;
      }
    });
    this._mergeTask = stream.pipeTo(
      new WritableStream({
        write: (chunk) => {
          switch (chunk.type) {
            case "text-delta":
              this._controller.enqueue(chunk);
              break;
            case "part-finish":
              this._controller.enqueue({
                type: "tool-call-args-text-finish",
                path: []
              });
              break;
            default:
              throw new Error(`Unexpected chunk type: ${chunk.type}`);
          }
        }
      })
    );
  }
  _isClosed = false;
  _mergeTask;
  get argsText() {
    return this._argsTextController;
  }
  _argsTextController;
  setResponse(response) {
    this._controller.enqueue({
      type: "result",
      path: [],
      artifact: response.artifact,
      result: response.result,
      isError: response.isError ?? false
    });
  }
  async close() {
    if (this._isClosed) return;
    this._isClosed = true;
    this._argsTextController.close();
    await this._mergeTask;
    this._controller.enqueue({
      type: "part-finish",
      path: []
    });
    this._controller.close();
  }
};
var createToolCallStream = (readable) => {
  return new ReadableStream({
    start(c) {
      return readable.start?.(new ToolCallStreamControllerImpl(c));
    },
    pull(c) {
      return readable.pull?.(new ToolCallStreamControllerImpl(c));
    },
    cancel(c) {
      return readable.cancel?.(c);
    }
  });
};
var createToolCallStreamController = () => {
  let controller;
  const stream = createToolCallStream({
    start(c) {
      controller = c;
    }
  });
  return [stream, controller];
};

// src/core/utils/Counter.ts
var Counter = class {
  value = -1;
  up() {
    return ++this.value;
  }
};

// src/core/utils/stream/path-utils.ts
var PathAppendEncoder = class extends TransformStream {
  constructor(idx) {
    super({
      transform(chunk, controller) {
        controller.enqueue({
          ...chunk,
          path: [idx, ...chunk.path]
        });
      }
    });
  }
};
var PathAppendDecoder = class extends TransformStream {
  constructor(idx) {
    super({
      transform(chunk, controller) {
        const {
          path: [idx2, ...path]
        } = chunk;
        if (idx !== idx2)
          throw new Error(`Path mismatch: expected ${idx}, got ${idx2}`);
        controller.enqueue({
          ...chunk,
          path
        });
      }
    });
  }
};
var PathMergeEncoder = class extends TransformStream {
  constructor(counter) {
    const innerCounter = new Counter();
    const mapping = /* @__PURE__ */ new Map();
    super({
      transform(chunk, controller) {
        if (chunk.type === "part-start" && chunk.path.length === 0) {
          mapping.set(innerCounter.up(), counter.up());
        }
        const [idx, ...path] = chunk.path;
        if (idx === void 0) {
          controller.enqueue(chunk);
          return;
        }
        const mappedIdx = mapping.get(idx);
        if (mappedIdx === void 0) throw new Error("Path not found");
        controller.enqueue({
          ...chunk,
          path: [mappedIdx, ...path]
        });
      }
    });
  }
};

// src/core/utils/generateId.tsx
var import_non_secure = require("nanoid/non-secure");
var generateId = (0, import_non_secure.customAlphabet)(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

// src/core/modules/assistant-stream.ts
var AssistantStreamControllerImpl = class {
  _merger = createMergeStream();
  _append;
  _contentCounter = new Counter();
  get __internal_isClosed() {
    return this._merger.isSealed();
  }
  __internal_getReadable() {
    return this._merger.readable;
  }
  _closeSubscriber;
  __internal_subscribeToClose(callback) {
    this._closeSubscriber = callback;
  }
  _addPart(part, stream) {
    if (this._append) {
      this._append.controller.close();
      this._append = void 0;
    }
    this.enqueue({
      type: "part-start",
      part,
      path: []
    });
    this._merger.addStream(
      stream.pipeThrough(new PathAppendEncoder(this._contentCounter.value))
    );
  }
  merge(stream) {
    this._merger.addStream(
      stream.pipeThrough(new PathMergeEncoder(this._contentCounter))
    );
  }
  appendText(textDelta) {
    if (this._append?.kind !== "text") {
      this._append = {
        kind: "text",
        controller: this.addTextPart()
      };
    }
    this._append.controller.append(textDelta);
  }
  appendReasoning(textDelta) {
    if (this._append?.kind !== "reasoning") {
      this._append = {
        kind: "reasoning",
        controller: this.addReasoningPart()
      };
    }
    this._append.controller.append(textDelta);
  }
  addTextPart() {
    const [stream, controller] = createTextStreamController();
    this._addPart({ type: "text" }, stream);
    return controller;
  }
  addReasoningPart() {
    const [stream, controller] = createTextStreamController();
    this._addPart({ type: "reasoning" }, stream);
    return controller;
  }
  addToolCallPart(options) {
    const opt = typeof options === "string" ? { toolName: options } : options;
    const toolName = opt.toolName;
    const toolCallId = opt.toolCallId ?? generateId();
    const [stream, controller] = createToolCallStreamController();
    this._addPart({ type: "tool-call", toolName, toolCallId }, stream);
    if (opt.argsText !== void 0) {
      controller.argsText.append(opt.argsText);
      controller.argsText.close();
    }
    if (opt.args !== void 0) {
      controller.argsText.append(JSON.stringify(opt.args));
      controller.argsText.close();
    }
    if (opt.response !== void 0) {
      controller.setResponse(opt.response);
    }
    return controller;
  }
  appendSource(options) {
    this._addPart(
      options,
      new ReadableStream({
        start(controller) {
          controller.enqueue({
            type: "part-finish",
            path: []
          });
          controller.close();
        }
      })
    );
  }
  appendFile(options) {
    this._addPart(
      options,
      new ReadableStream({
        start(controller) {
          controller.enqueue({
            type: "part-finish",
            path: []
          });
          controller.close();
        }
      })
    );
  }
  enqueue(chunk) {
    this._merger.enqueue(chunk);
    if (chunk.type === "part-start" && chunk.path.length === 0) {
      this._contentCounter.up();
    }
  }
  close() {
    this._merger.seal();
    this._append?.controller?.close();
    this._closeSubscriber?.();
  }
};
function createAssistantStream(callback) {
  const controller = new AssistantStreamControllerImpl();
  let promiseOrVoid;
  try {
    promiseOrVoid = callback(controller);
  } catch (e) {
    if (!controller.__internal_isClosed) {
      controller.enqueue({
        type: "error",
        path: [],
        error: String(e)
      });
      controller.close();
    }
    throw e;
  }
  if (promiseOrVoid instanceof Promise) {
    const runTask = async () => {
      try {
        await promiseOrVoid;
      } catch (e) {
        if (!controller.__internal_isClosed) {
          controller.enqueue({
            type: "error",
            path: [],
            error: String(e)
          });
        }
        throw e;
      } finally {
        if (!controller.__internal_isClosed) {
          controller.close();
        }
      }
    };
    runTask();
  } else {
    if (!controller.__internal_isClosed) {
      controller.close();
    }
  }
  return controller.__internal_getReadable();
}
var promiseWithResolvers2 = function() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (!resolve || !reject) throw new Error("Failed to create promise");
  return { promise, resolve, reject };
};
function createAssistantStreamController() {
  const { resolve, promise } = promiseWithResolvers2();
  let controller;
  const stream = createAssistantStream((c) => {
    controller = c;
    controller.__internal_subscribeToClose(
      resolve
    );
    return promise;
  });
  return [stream, controller];
}

// src/core/utils/stream/AssistantTransformStream.ts
var AssistantTransformStream = class extends TransformStream {
  constructor(transformer, writableStrategy, readableStrategy) {
    const [stream, runController] = createAssistantStreamController();
    let runPipeTask;
    super(
      {
        start(controller) {
          runPipeTask = stream.pipeTo(
            new WritableStream({
              write(chunk) {
                controller.enqueue(chunk);
              },
              abort(reason) {
                controller.error(reason);
              },
              close() {
                controller.terminate();
              }
            })
          ).catch((error) => {
            controller.error(error);
          });
          return transformer.start?.(runController);
        },
        transform(chunk) {
          return transformer.transform?.(chunk, runController);
        },
        async flush() {
          await transformer.flush?.(runController);
          runController.close();
          await runPipeTask;
        }
      },
      writableStrategy,
      readableStrategy
    );
  }
};

// src/ai-sdk/index.ts
var fromStreamText = (stream) => {
  const toolControllers = /* @__PURE__ */ new Map();
  let currentToolCallArgsText;
  const endCurrentToolCallArgsText = () => {
    if (!currentToolCallArgsText) return;
    currentToolCallArgsText.argsText.close();
    currentToolCallArgsText = void 0;
  };
  const transformer = new AssistantTransformStream({
    transform(chunk, controller) {
      const { type } = chunk;
      if (type !== "tool-call-delta" && type !== "tool-call" && type !== "error" && type !== "tool-result") {
        endCurrentToolCallArgsText();
      }
      switch (type) {
        case "text-delta": {
          const { textDelta } = chunk;
          controller.appendText(textDelta);
          break;
        }
        case "reasoning": {
          const { textDelta } = chunk;
          controller.appendReasoning(textDelta);
          break;
        }
        case "tool-call-streaming-start": {
          const { toolCallId, toolName } = chunk;
          currentToolCallArgsText = controller.addToolCallPart({
            toolCallId,
            toolName
          });
          toolControllers.set(toolCallId, currentToolCallArgsText);
          break;
        }
        case "tool-call-delta": {
          const { toolCallId, argsTextDelta } = chunk;
          const toolController = toolControllers.get(toolCallId);
          if (!toolController) throw new Error("Tool call not found");
          toolController.argsText.append(argsTextDelta);
          break;
        }
        case "tool-result": {
          const { toolCallId, result } = chunk;
          const toolController = toolControllers.get(toolCallId);
          if (!toolController) throw new Error("Tool call not found");
          toolController.setResponse({
            result
          });
          toolController.close();
          toolControllers.delete(toolCallId);
          break;
        }
        case "tool-call": {
          const { toolCallId, toolName, args } = chunk;
          const toolController = controller.addToolCallPart({
            toolCallId,
            toolName
          });
          toolController.argsText.append(JSON.stringify(args));
          toolController.argsText.close();
          toolControllers.set(toolCallId, toolController);
          break;
        }
        case "step-start":
          controller.enqueue({
            type: "step-start",
            path: [],
            messageId: chunk.messageId
          });
          break;
        case "step-finish":
          controller.enqueue({
            type: "step-finish",
            path: [],
            finishReason: chunk.finishReason,
            usage: chunk.usage,
            isContinued: chunk.isContinued
          });
          break;
        case "error":
          controller.enqueue({
            type: "error",
            path: [],
            error: String(chunk.error)
          });
          break;
        case "finish": {
          controller.enqueue({
            type: "message-finish",
            path: [],
            finishReason: chunk.finishReason,
            usage: chunk.usage
          });
          break;
        }
        case "source":
          controller.appendSource({
            type: "source",
            ...chunk.source
          });
          break;
        case "file":
          controller.appendFile({
            type: "file",
            mimeType: chunk.mimeType,
            data: chunk.base64
          });
          break;
        case "reasoning-signature":
        case "redacted-reasoning":
          break;
        default: {
          const unhandledType = type;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    },
    flush() {
      for (const toolController of toolControllers.values()) {
        toolController.close();
      }
      toolControllers.clear();
    }
  });
  return stream.pipeThrough(transformer);
};
var fromStreamObject = (stream, toolName) => {
  let toolCall;
  const transformer = new AssistantTransformStream({
    start(controller) {
      toolCall = controller.addToolCallPart(toolName);
    },
    transform(chunk, controller) {
      const { type } = chunk;
      switch (type) {
        case "text-delta": {
          const { textDelta } = chunk;
          toolCall.argsText.append(textDelta);
          break;
        }
        case "finish": {
          toolCall.argsText.close();
          toolCall.setResponse({
            result: "{}"
          });
          break;
        }
        case "object":
          break;
        case "error": {
          controller.enqueue({
            type: "error",
            path: [],
            error: String(chunk.error)
          });
          break;
        }
        default: {
          const unhandledType = type;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    }
  });
  return stream.pipeThrough(transformer);
};

// src/ai-sdk/language-model.ts
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...buffer));
}
var LanguageModelV1StreamDecoder = class extends AssistantTransformStream {
  constructor() {
    let currentToolCall;
    const endCurrentToolCall = () => {
      if (!currentToolCall) return;
      currentToolCall.controller.argsText.close();
      currentToolCall.controller.close();
      currentToolCall = void 0;
    };
    super({
      transform(chunk, controller) {
        const { type } = chunk;
        if (type === "text-delta" || type === "reasoning" || type === "tool-call") {
          endCurrentToolCall();
        }
        switch (type) {
          case "text-delta": {
            controller.appendText(chunk.textDelta);
            break;
          }
          case "reasoning": {
            controller.appendReasoning(chunk.textDelta);
            break;
          }
          case "source": {
            controller.appendSource({
              type: "source",
              ...chunk.source
            });
            break;
          }
          case "file": {
            controller.appendFile({
              type: "file",
              mimeType: chunk.mimeType,
              data: typeof chunk.data === "string" ? chunk.data : bufferToBase64(chunk.data)
            });
            break;
          }
          case "tool-call-delta": {
            const { toolCallId, toolName, argsTextDelta } = chunk;
            if (currentToolCall?.toolCallId === toolCallId) {
              currentToolCall.controller.argsText.append(argsTextDelta);
            } else {
              endCurrentToolCall();
              currentToolCall = {
                toolCallId,
                controller: controller.addToolCallPart({
                  toolCallId,
                  toolName
                })
              };
              currentToolCall.controller.argsText.append(argsTextDelta);
            }
            break;
          }
          case "tool-call": {
            const { toolCallId, toolName, args } = chunk;
            if (currentToolCall?.toolCallId === toolCallId) {
              currentToolCall.controller.argsText.close();
            } else {
              const toolController = controller.addToolCallPart({
                toolCallId,
                toolName,
                argsText: args
              });
              toolController.close();
            }
            break;
          }
          case "finish": {
            controller.enqueue({
              type: "message-finish",
              finishReason: chunk.finishReason,
              usage: chunk.usage,
              path: []
            });
            controller.close();
            break;
          }
          case "error":
          case "response-metadata":
          case "reasoning-signature":
          case "redacted-reasoning":
            break;
          default: {
            const unhandledType = type;
            throw new Error(`Unhandled chunk type: ${unhandledType}`);
          }
        }
      },
      flush() {
        endCurrentToolCall();
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LanguageModelV1StreamDecoder,
  fromStreamObject,
  fromStreamText
});
//# sourceMappingURL=ai-sdk.js.map