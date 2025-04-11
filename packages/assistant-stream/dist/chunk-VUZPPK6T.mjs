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

// src/core/utils/generateId.tsx
import { customAlphabet } from "nanoid/non-secure";
var generateId = customAlphabet(
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

export {
  AssistantStream,
  PipeableTransformStream,
  AssistantMetaTransformStream,
  DataStreamEncoder,
  DataStreamDecoder,
  generateId,
  createAssistantStream,
  createAssistantStreamResponse,
  AssistantTransformStream
};
//# sourceMappingURL=chunk-VUZPPK6T.mjs.map