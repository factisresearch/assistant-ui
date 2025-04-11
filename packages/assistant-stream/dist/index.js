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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AssistantMessageAccumulator: () => AssistantMessageAccumulator,
  AssistantMessageStream: () => AssistantMessageStream,
  AssistantStream: () => AssistantStream,
  DataStreamDecoder: () => DataStreamDecoder,
  DataStreamEncoder: () => DataStreamEncoder,
  PlainTextDecoder: () => PlainTextDecoder,
  PlainTextEncoder: () => PlainTextEncoder,
  ToolExecutionStream: () => ToolExecutionStream,
  ToolResponse: () => ToolResponse,
  createAssistantStream: () => createAssistantStream,
  createAssistantStreamResponse: () => createAssistantStreamResponse
});
module.exports = __toCommonJS(index_exports);

// src/core/AssistantStream.ts
var AssistantStream = {
  toResponse(stream, transformer) {
    return new Response(AssistantStream.toByteStream(stream, transformer), {
      headers: transformer.headers ?? {}
    });
  },
  fromResponse(response, transformer) {
    return AssistantStream.fromByteStream(response.body, transformer);
  },
  toByteStream(stream, transformer) {
    return stream.pipeThrough(transformer);
  },
  fromByteStream(readable, transformer) {
    return readable.pipeThrough(transformer);
  }
};

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

// src/core/utils/stream/PipeableTransformStream.ts
var PipeableTransformStream = class extends TransformStream {
  constructor(transform) {
    super();
    const readable = transform(super.readable);
    Object.defineProperty(this, "readable", {
      value: readable,
      writable: false
    });
  }
};

// src/core/utils/stream/LineDecoderStream.ts
var LineDecoderStream = class extends TransformStream {
  buffer = "";
  constructor() {
    super({
      transform: (chunk, controller) => {
        this.buffer += chunk;
        const lines = this.buffer.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
          controller.enqueue(lines[i]);
        }
        this.buffer = lines[lines.length - 1] || "";
      },
      flush: (controller) => {
        if (this.buffer) {
          controller.enqueue(this.buffer);
        }
      }
    });
  }
};

// src/core/serialization/data-stream/serialization.ts
var DataStreamChunkEncoder = class extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        controller.enqueue(`${chunk.type}:${JSON.stringify(chunk.value)}
`);
      }
    });
  }
};
var DataStreamChunkDecoder = class extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        const index = chunk.indexOf(":");
        if (index === -1) throw new Error("Invalid stream part");
        controller.enqueue({
          type: chunk.slice(0, index),
          value: JSON.parse(chunk.slice(index + 1))
        });
      }
    });
  }
};

// src/core/utils/stream/AssistantMetaTransformStream.ts
var AssistantMetaTransformStream = class extends TransformStream {
  constructor() {
    const parts = [];
    super({
      transform(chunk, controller) {
        if (chunk.type === "part-start") {
          if (chunk.path.length !== 0) {
            controller.error(new Error("Nested parts are not supported"));
            return;
          }
          parts.push(chunk.part);
          controller.enqueue(chunk);
          return;
        }
        if (chunk.type === "text-delta" || chunk.type === "result" || chunk.type === "part-finish" || chunk.type === "tool-call-args-text-finish") {
          if (chunk.path.length !== 1) {
            controller.error(
              new Error(`${chunk.type} chunks must have a path of length 1`)
            );
            return;
          }
          const idx = chunk.path[0];
          if (idx < 0 || idx >= parts.length) {
            controller.error(new Error(`Invalid path index: ${idx}`));
            return;
          }
          const part = parts[idx];
          controller.enqueue({
            ...chunk,
            meta: part
            // TODO
          });
          return;
        }
        controller.enqueue(chunk);
      }
    });
  }
};

// src/core/serialization/data-stream/DataStream.ts
var DataStreamEncoder = class extends PipeableTransformStream {
  headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "x-vercel-ai-data-stream": "v1"
  });
  constructor() {
    super((readable) => {
      const transform = new TransformStream({
        transform(chunk, controller) {
          const type = chunk.type;
          switch (type) {
            case "part-start": {
              const part = chunk.part;
              if (part.type === "tool-call") {
                const { type: type2, ...value } = part;
                controller.enqueue({
                  type: "b" /* StartToolCall */,
                  value
                });
              }
              if (part.type === "source") {
                const { type: type2, ...value } = part;
                controller.enqueue({
                  type: "h" /* Source */,
                  value
                });
              }
              break;
            }
            case "text-delta": {
              const part = chunk.meta;
              switch (part.type) {
                case "text": {
                  controller.enqueue({
                    type: "0" /* TextDelta */,
                    value: chunk.textDelta
                  });
                  break;
                }
                case "reasoning": {
                  controller.enqueue({
                    type: "g" /* ReasoningDelta */,
                    value: chunk.textDelta
                  });
                  break;
                }
                case "tool-call": {
                  controller.enqueue({
                    type: "c" /* ToolCallArgsTextDelta */,
                    value: {
                      toolCallId: part.toolCallId,
                      argsTextDelta: chunk.textDelta
                    }
                  });
                  break;
                }
                default:
                  throw new Error(
                    `Unsupported part type for text-delta: ${part.type}`
                  );
              }
              break;
            }
            case "result": {
              const part = chunk.meta;
              if (part.type !== "tool-call") {
                throw new Error(
                  `Result chunk on non-tool-call part not supported: ${part.type}`
                );
              }
              controller.enqueue({
                type: "a" /* ToolCallResult */,
                value: {
                  toolCallId: part.toolCallId,
                  result: chunk.result,
                  artifact: chunk.artifact,
                  ...chunk.isError ? { isError: chunk.isError } : {}
                }
              });
              break;
            }
            case "step-start": {
              const { type: type2, ...value } = chunk;
              controller.enqueue({
                type: "f" /* StartStep */,
                value
              });
              break;
            }
            case "step-finish": {
              const { type: type2, ...value } = chunk;
              controller.enqueue({
                type: "e" /* FinishStep */,
                value
              });
              break;
            }
            case "message-finish": {
              const { type: type2, ...value } = chunk;
              controller.enqueue({
                type: "d" /* FinishMessage */,
                value
              });
              break;
            }
            case "error": {
              controller.enqueue({
                type: "3" /* Error */,
                value: chunk.error
              });
              break;
            }
            case "annotations": {
              controller.enqueue({
                type: "8" /* Annotation */,
                value: chunk.annotations
              });
              break;
            }
            case "data": {
              controller.enqueue({
                type: "2" /* Data */,
                value: chunk.data
              });
              break;
            }
            // TODO ignore for now
            // in the future, we should create a handler that waits for text parts to finish before continuing
            case "tool-call-args-text-finish":
            case "part-finish":
              break;
            default: {
              const exhaustiveCheck = type;
              throw new Error(`Unsupported chunk type: ${exhaustiveCheck}`);
            }
          }
        }
      });
      return readable.pipeThrough(new AssistantMetaTransformStream()).pipeThrough(transform).pipeThrough(new DataStreamChunkEncoder()).pipeThrough(new TextEncoderStream());
    });
  }
};
var TOOL_CALL_ARGS_CLOSING_CHUNKS = [
  "b" /* StartToolCall */,
  "9" /* ToolCall */,
  "0" /* TextDelta */,
  "g" /* ReasoningDelta */,
  "h" /* Source */,
  "3" /* Error */,
  "e" /* FinishStep */,
  "d" /* FinishMessage */
];
var DataStreamDecoder = class extends PipeableTransformStream {
  constructor() {
    super((readable) => {
      const toolCallControllers = /* @__PURE__ */ new Map();
      let activeToolCallArgsText;
      const transform = new AssistantTransformStream({
        transform(chunk, controller) {
          const { type, value } = chunk;
          if (TOOL_CALL_ARGS_CLOSING_CHUNKS.includes(type)) {
            activeToolCallArgsText?.close();
            activeToolCallArgsText = void 0;
          }
          switch (type) {
            case "g" /* ReasoningDelta */:
              controller.appendReasoning(value);
              break;
            case "0" /* TextDelta */:
              controller.appendText(value);
              break;
            case "b" /* StartToolCall */: {
              const { toolCallId, toolName } = value;
              const toolCallController = controller.addToolCallPart({
                toolCallId,
                toolName
              });
              toolCallControllers.set(toolCallId, toolCallController);
              activeToolCallArgsText = toolCallController.argsText;
              break;
            }
            case "c" /* ToolCallArgsTextDelta */: {
              const { toolCallId, argsTextDelta } = value;
              const toolCallController = toolCallControllers.get(toolCallId);
              if (!toolCallController)
                throw new Error(
                  "Encountered tool call with unknown id: " + toolCallId
                );
              toolCallController.argsText.append(argsTextDelta);
              break;
            }
            case "a" /* ToolCallResult */: {
              const { toolCallId, artifact, result, isError } = value;
              const toolCallController = toolCallControllers.get(toolCallId);
              if (!toolCallController)
                throw new Error(
                  "Encountered tool call result with unknown id: " + toolCallId
                );
              toolCallController.setResponse({
                artifact,
                result,
                isError
              });
              break;
            }
            case "9" /* ToolCall */: {
              const { toolCallId, toolName, args } = value;
              let toolCallController = toolCallControllers.get(toolCallId);
              if (toolCallController) {
                toolCallController.argsText.close();
              } else {
                toolCallController = controller.addToolCallPart({
                  toolCallId,
                  toolName,
                  args
                });
                toolCallControllers.set(toolCallId, toolCallController);
              }
              break;
            }
            case "d" /* FinishMessage */:
              controller.enqueue({
                type: "message-finish",
                path: [],
                ...value
              });
              break;
            case "f" /* StartStep */:
              controller.enqueue({
                type: "step-start",
                path: [],
                ...value
              });
              break;
            case "e" /* FinishStep */:
              controller.enqueue({
                type: "step-finish",
                path: [],
                ...value
              });
              break;
            case "2" /* Data */:
              controller.enqueue({
                type: "data",
                path: [],
                data: value
              });
              break;
            case "8" /* Annotation */:
              controller.enqueue({
                type: "annotations",
                path: [],
                annotations: value
              });
              break;
            case "h" /* Source */:
              controller.appendSource({
                type: "source",
                ...value
              });
              break;
            case "3" /* Error */:
              controller.enqueue({
                type: "error",
                path: [],
                error: value
              });
              break;
            case "k" /* File */:
              controller.appendFile({
                type: "file",
                ...value
              });
              break;
            case "j" /* ReasoningSignature */:
            case "i" /* RedactedReasoning */:
              break;
            default: {
              const exhaustiveCheck = type;
              throw new Error(`unsupported chunk type: ${exhaustiveCheck}`);
            }
          }
        },
        flush() {
          activeToolCallArgsText?.close();
          activeToolCallArgsText = void 0;
          toolCallControllers.forEach((controller) => controller.close());
          toolCallControllers.clear();
        }
      });
      return readable.pipeThrough(new TextDecoderStream()).pipeThrough(new LineDecoderStream()).pipeThrough(new DataStreamChunkDecoder()).pipeThrough(transform);
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
function createAssistantStreamResponse(callback) {
  return AssistantStream.toResponse(
    createAssistantStream(callback),
    new DataStreamEncoder()
  );
}

// src/core/effects/ToolExecutionStream.ts
var import_secure_json_parse = __toESM(require("secure-json-parse"));

// src/core/utils/withPromiseOrValue.ts
function withPromiseOrValue(callback, thenHandler, catchHandler) {
  try {
    const promiseOrValue = callback();
    if (typeof promiseOrValue === "object" && promiseOrValue !== null && "then" in promiseOrValue) {
      return promiseOrValue.then(thenHandler, catchHandler);
    } else {
      thenHandler(promiseOrValue);
    }
  } catch (e) {
    catchHandler(e);
  }
}

// src/core/effects/ToolExecutionStream.ts
var ToolExecutionStream = class extends PipeableTransformStream {
  constructor(toolCallback) {
    const toolCallPromises = /* @__PURE__ */ new Map();
    const toolCallArgsText = {};
    super((readable) => {
      const transform = new TransformStream({
        transform(chunk, controller) {
          if (chunk.type !== "part-finish" || chunk.meta.type !== "tool-call") {
            controller.enqueue(chunk);
          }
          const type = chunk.type;
          switch (type) {
            case "text-delta": {
              if (chunk.meta.type === "tool-call") {
                const toolCallId = chunk.meta.toolCallId;
                if (toolCallArgsText[toolCallId] === void 0) {
                  toolCallArgsText[toolCallId] = chunk.textDelta;
                } else {
                  toolCallArgsText[toolCallId] += chunk.textDelta;
                }
              }
              break;
            }
            case "tool-call-args-text-finish": {
              if (chunk.meta.type !== "tool-call") break;
              const { toolCallId, toolName } = chunk.meta;
              const argsText = toolCallArgsText[toolCallId];
              const promise = withPromiseOrValue(
                () => {
                  if (!argsText) {
                    console.log(
                      "Encountered tool call without argsText, this should never happen"
                    );
                    throw new Error(
                      "Encountered tool call without argsText, this is unexpected."
                    );
                  }
                  let args;
                  try {
                    args = import_secure_json_parse.default.parse(argsText);
                  } catch (e) {
                    throw new Error(
                      `Function parameter parsing failed. ${JSON.stringify(e.message)}`
                    );
                  }
                  return toolCallback({
                    toolCallId,
                    toolName,
                    args
                  });
                },
                (c) => {
                  if (c === void 0) return;
                  controller.enqueue({
                    type: "result",
                    path: chunk.path,
                    artifact: c.artifact,
                    result: c.result,
                    isError: c.isError
                  });
                },
                (e) => {
                  controller.enqueue({
                    type: "result",
                    path: chunk.path,
                    result: String(e),
                    isError: true
                  });
                }
              );
              if (promise) {
                toolCallPromises.set(toolCallId, promise);
              }
              break;
            }
            case "part-finish": {
              if (chunk.meta.type !== "tool-call") break;
              const { toolCallId } = chunk.meta;
              const toolCallPromise = toolCallPromises.get(toolCallId);
              if (toolCallPromise) {
                toolCallPromise.then(() => {
                  controller.enqueue(chunk);
                });
              } else {
                controller.enqueue(chunk);
              }
            }
          }
        },
        async flush() {
          await Promise.all(toolCallPromises.values());
        }
      });
      return readable.pipeThrough(new AssistantMetaTransformStream()).pipeThrough(transform);
    });
  }
};

// src/core/utils/json/parse-partial-json.ts
var import_secure_json_parse2 = __toESM(require("secure-json-parse"));

// src/core/utils/json/fix-json.ts
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}

// src/core/utils/json/parse-partial-json.ts
var parsePartialJson = (json) => {
  try {
    return import_secure_json_parse2.default.parse(json);
  } catch {
    try {
      return import_secure_json_parse2.default.parse(fixJson(json));
    } catch {
      return void 0;
    }
  }
};

// src/core/accumulators/assistant-message-accumulator.ts
var createInitialMessage = () => ({
  role: "assistant",
  status: { type: "running" },
  parts: [],
  get content() {
    return this.parts;
  },
  metadata: {
    unstable_data: [],
    unstable_annotations: [],
    steps: [],
    custom: {}
  }
});
var updatePartForPath = (message, chunk, updater) => {
  if (message.parts.length === 0) {
    throw new Error("No parts available to update.");
  }
  if (chunk.path.length !== 1)
    throw new Error("Nested paths are not supported yet.");
  const partIndex = chunk.path[0];
  const updatedPart = updater(message.parts[partIndex]);
  return {
    ...message,
    parts: [
      ...message.parts.slice(0, partIndex),
      updatedPart,
      ...message.parts.slice(partIndex + 1)
    ],
    get content() {
      return this.parts;
    }
  };
};
var handlePartStart = (message, chunk) => {
  const partInit = chunk.part;
  if (partInit.type === "text" || partInit.type === "reasoning") {
    const newTextPart = {
      type: partInit.type,
      text: "",
      status: { type: "running" }
    };
    return {
      ...message,
      parts: [...message.parts, newTextPart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "tool-call") {
    const newToolCallPart = {
      type: "tool-call",
      state: "partial-call",
      status: { type: "running", isArgsComplete: false },
      toolCallId: partInit.toolCallId,
      toolName: partInit.toolName,
      argsText: "",
      args: {}
    };
    return {
      ...message,
      parts: [...message.parts, newToolCallPart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "source") {
    const newSourcePart = {
      type: "source",
      sourceType: partInit.sourceType,
      id: partInit.id,
      url: partInit.url,
      ...partInit.title ? { title: partInit.title } : void 0
    };
    return {
      ...message,
      parts: [...message.parts, newSourcePart],
      get content() {
        return this.parts;
      }
    };
  } else if (partInit.type === "file") {
    const newFilePart = {
      type: "file",
      mimeType: partInit.mimeType,
      data: partInit.data
    };
    return {
      ...message,
      parts: [...message.parts, newFilePart],
      get content() {
        return this.parts;
      }
    };
  } else {
    throw new Error(`Unsupported part type: ${partInit.type}`);
  }
};
var handleToolCallArgsTextFinish = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => {
    if (part.type !== "tool-call") {
      throw new Error("Last is not a tool call");
    }
    return {
      ...part,
      state: "call"
    };
  });
};
var handlePartFinish = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => ({
    ...part,
    status: { type: "complete", reason: "unknown" }
  }));
};
var handleTextDelta = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => {
    if (part.type === "text") {
      return { ...part, text: part.text + chunk.textDelta };
    } else if (part.type === "tool-call") {
      const newArgsText = part.argsText + chunk.textDelta;
      let newArgs;
      try {
        newArgs = parsePartialJson(newArgsText);
      } catch (err) {
        newArgs = part.args;
      }
      return { ...part, argsText: newArgsText, args: newArgs };
    } else {
      throw new Error(
        "text-delta received but part is neither text nor tool-call"
      );
    }
  });
};
var handleResult = (message, chunk) => {
  return updatePartForPath(message, chunk, (part) => {
    if (part.type === "tool-call") {
      return {
        ...part,
        state: "result",
        artifact: chunk.artifact,
        result: chunk.result,
        isError: chunk.isError ?? false,
        status: { type: "complete", reason: "stop" }
      };
    } else {
      throw new Error("Result chunk received but part is not a tool-call");
    }
  });
};
var handleMessageFinish = (message, chunk) => {
  const newStatus = getStatus(chunk);
  return { ...message, status: newStatus };
};
var getStatus = (chunk) => {
  if (chunk.finishReason === "tool-calls") {
    return {
      type: "requires-action",
      reason: "tool-calls"
    };
  } else if (chunk.finishReason === "stop" || chunk.finishReason === "unknown") {
    return {
      type: "complete",
      reason: chunk.finishReason
    };
  } else {
    return {
      type: "incomplete",
      reason: chunk.finishReason
    };
  }
};
var handleAnnotations = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_annotations: [
        ...message.metadata.unstable_annotations,
        ...chunk.annotations
      ]
    }
  };
};
var handleData = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_data: [...message.metadata.unstable_data, ...chunk.data]
    }
  };
};
var handleStepStart = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      steps: [
        ...message.metadata.steps,
        { state: "started", messageId: chunk.messageId }
      ]
    }
  };
};
var handleStepFinish = (message, chunk) => {
  const steps = message.metadata.steps.slice();
  const lastIndex = steps.length - 1;
  if (steps.length > 0 && steps[lastIndex]?.state === "started") {
    steps[lastIndex] = {
      ...steps[lastIndex],
      state: "finished",
      finishReason: chunk.finishReason,
      usage: chunk.usage,
      isContinued: chunk.isContinued
    };
  } else {
    steps.push({
      state: "finished",
      messageId: generateId(),
      finishReason: chunk.finishReason,
      usage: chunk.usage,
      isContinued: chunk.isContinued
    });
  }
  return {
    ...message,
    metadata: {
      ...message.metadata,
      steps
    }
  };
};
var handleErrorChunk = (message, chunk) => {
  return {
    ...message,
    status: { type: "incomplete", reason: "error", error: chunk.error }
  };
};
var AssistantMessageAccumulator = class extends TransformStream {
  constructor({
    initialMessage
  } = {}) {
    let message = initialMessage ?? createInitialMessage();
    super({
      transform(chunk, controller) {
        const type = chunk.type;
        switch (type) {
          case "part-start":
            message = handlePartStart(message, chunk);
            break;
          case "tool-call-args-text-finish":
            message = handleToolCallArgsTextFinish(message, chunk);
            break;
          case "part-finish":
            message = handlePartFinish(message, chunk);
            break;
          case "text-delta":
            message = handleTextDelta(message, chunk);
            break;
          case "result":
            message = handleResult(message, chunk);
            break;
          case "message-finish":
            message = handleMessageFinish(message, chunk);
            break;
          case "annotations":
            message = handleAnnotations(message, chunk);
            break;
          case "data":
            message = handleData(message, chunk);
            break;
          case "step-start":
            message = handleStepStart(message, chunk);
            break;
          case "step-finish":
            message = handleStepFinish(message, chunk);
            break;
          case "error":
            message = handleErrorChunk(message, chunk);
            break;
          default: {
            const unhandledType = type;
            throw new Error(`Unsupported chunk type: ${unhandledType}`);
          }
        }
        controller.enqueue(message);
      },
      flush(controller) {
        if (message.status?.type === "running") {
          const requiresAction = message.parts?.at(-1)?.type === "tool-call";
          message = handleMessageFinish(message, {
            type: "message-finish",
            path: [],
            finishReason: requiresAction ? "tool-calls" : "unknown",
            usage: {
              promptTokens: 0,
              completionTokens: 0
            }
          });
          controller.enqueue(message);
        }
      }
    });
  }
};

// src/core/serialization/PlainText.ts
var PlainTextEncoder = class extends PipeableTransformStream {
  headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "x-vercel-ai-data-stream": "v1"
  });
  constructor() {
    super((readable) => {
      const transform = new TransformStream({
        transform(chunk, controller) {
          const type = chunk.type;
          switch (type) {
            case "text-delta":
              controller.enqueue(chunk.textDelta);
              break;
            default:
              const unsupportedType = type;
              throw new Error(`unsupported chunk type: ${unsupportedType}`);
          }
        }
      });
      return readable.pipeThrough(transform).pipeThrough(new TextEncoderStream());
    });
  }
};
var PlainTextDecoder = class extends PipeableTransformStream {
  constructor() {
    super((readable) => {
      const transform = new AssistantTransformStream({
        transform(chunk, controller) {
          controller.appendText(chunk);
        }
      });
      return readable.pipeThrough(new TextDecoderStream()).pipeThrough(transform);
    });
  }
};

// src/core/accumulators/AssistantMessageStream.ts
var AssistantMessageStream = class _AssistantMessageStream {
  constructor(readable) {
    this.readable = readable;
    this.readable = readable;
  }
  static fromAssistantStream(stream) {
    return new _AssistantMessageStream(
      stream.pipeThrough(new AssistantMessageAccumulator())
    );
  }
  async unstable_result() {
    let last;
    for await (const chunk of this) {
      last = chunk;
    }
    if (!last) {
      return {
        role: "assistant",
        status: { type: "complete", reason: "unknown" },
        parts: [],
        content: [],
        metadata: {
          unstable_data: [],
          unstable_annotations: [],
          steps: [],
          custom: {}
        }
      };
    }
    return last;
  }
  [Symbol.asyncIterator]() {
    const reader = this.readable.getReader();
    return {
      async next() {
        const { done, value } = await reader.read();
        return done ? { done: true, value: void 0 } : { done: false, value };
      }
    };
  }
  tee() {
    const [readable1, readable2] = this.readable.tee();
    return [
      new _AssistantMessageStream(readable1),
      new _AssistantMessageStream(readable2)
    ];
  }
};

// src/core/ToolResponse.ts
var TOOL_RESPONSE_SYMBOL = Symbol.for("aui.tool-response");
var ToolResponse = class {
  get [TOOL_RESPONSE_SYMBOL]() {
    return true;
  }
  artifact;
  result;
  isError;
  constructor(options) {
    this.artifact = options.artifact;
    this.result = options.result;
    this.isError = options.isError ?? false;
  }
  static [Symbol.hasInstance](obj) {
    return typeof obj === "object" && obj !== null && TOOL_RESPONSE_SYMBOL in obj;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssistantMessageAccumulator,
  AssistantMessageStream,
  AssistantStream,
  DataStreamDecoder,
  DataStreamEncoder,
  PlainTextDecoder,
  PlainTextEncoder,
  ToolExecutionStream,
  ToolResponse,
  createAssistantStream,
  createAssistantStreamResponse
});
//# sourceMappingURL=index.js.map