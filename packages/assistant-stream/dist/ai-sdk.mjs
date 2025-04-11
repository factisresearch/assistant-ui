import {
  AssistantTransformStream
} from "./chunk-VUZPPK6T.mjs";

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
export {
  LanguageModelV1StreamDecoder,
  fromStreamObject,
  fromStreamText
};
//# sourceMappingURL=ai-sdk.mjs.map