import {
  AssistantMetaTransformStream,
  AssistantStream,
  AssistantTransformStream,
  DataStreamDecoder,
  DataStreamEncoder,
  PipeableTransformStream,
  createAssistantStream,
  createAssistantStreamResponse,
  generateId
} from "./chunk-VUZPPK6T.mjs";

// src/core/effects/ToolExecutionStream.ts
import sjson from "secure-json-parse";

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
                    args = sjson.parse(argsText);
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
import sjson2 from "secure-json-parse";

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
    return sjson2.parse(json);
  } catch {
    try {
      return sjson2.parse(fixJson(json));
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
export {
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
};
//# sourceMappingURL=index.mjs.map