// src/runtimes/edge/streams/runResultStream.ts
import { parsePartialJson } from "../../../utils/json/parse-partial-json.mjs";
function runResultStream() {
  let message = {
    content: [],
    status: { type: "running" }
  };
  return new TransformStream({
    transform(chunk, controller) {
      const chunkType = chunk.type;
      switch (chunkType) {
        case "reasoning": {
          message = appendOrUpdateReasoning(message, chunk.textDelta);
          controller.enqueue(message);
          break;
        }
        case "text-delta": {
          message = appendOrUpdateText(message, chunk.textDelta);
          controller.enqueue(message);
          break;
        }
        case "tool-call-delta": {
          const { toolCallId, toolName, argsTextDelta } = chunk;
          message = appendOrUpdateToolCall(
            message,
            toolCallId,
            toolName,
            argsTextDelta
          );
          controller.enqueue(message);
          break;
        }
        case "tool-call":
        // ignoring tool call events because they are converted to tool-call-delta as well
        case "response-metadata":
          break;
        case "annotations": {
          message = appendAnnotations(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "data": {
          message = appendData(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "source": {
          message = appendSource(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "tool-result": {
          message = appendOrUpdateToolResult(
            message,
            chunk.toolCallId,
            chunk.toolName,
            chunk.result
          );
          controller.enqueue(message);
          break;
        }
        case "step-finish": {
          message = appendStepFinish(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "finish": {
          message = appendOrUpdateFinish(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "error": {
          if (chunk.error instanceof Error && chunk.error.name === "AbortError") {
            message = appendOrUpdateCancel(message);
            controller.enqueue(message);
            break;
          } else {
            throw chunk.error;
          }
        }
        default: {
          const unhandledType = chunkType;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    },
    flush(controller) {
      if (message.status?.type === "running") {
        const requiresAction = message.content?.at(-1)?.type === "tool-call";
        message = appendOrUpdateFinish(message, {
          type: "finish",
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
var appendOrUpdateReasoning = (message, textDelta) => {
  let contentParts = message.content ?? [];
  let contentPart = message.content?.at(-1);
  if (contentPart?.type !== "reasoning") {
    contentPart = { type: "reasoning", text: textDelta };
  } else {
    contentParts = contentParts.slice(0, -1);
    contentPart = { type: "reasoning", text: contentPart.text + textDelta };
  }
  return {
    ...message,
    content: contentParts.concat([contentPart])
  };
};
var appendOrUpdateText = (message, textDelta) => {
  let contentParts = message.content ?? [];
  let contentPart = message.content?.at(-1);
  if (contentPart?.type !== "text") {
    contentPart = { type: "text", text: textDelta };
  } else {
    contentParts = contentParts.slice(0, -1);
    contentPart = { type: "text", text: contentPart.text + textDelta };
  }
  return {
    ...message,
    content: contentParts.concat([contentPart])
  };
};
var appendOrUpdateToolCall = (message, toolCallId, toolName, argsTextDelta) => {
  let contentParts = message.content ?? [];
  const contentPartIdx = contentParts.findIndex(
    (c) => c.type === "tool-call" && c.toolCallId === toolCallId
  );
  let contentPart = contentPartIdx === -1 ? null : contentParts[contentPartIdx];
  if (contentPart == null) {
    contentPart = {
      type: "tool-call",
      toolCallId,
      toolName,
      argsText: argsTextDelta,
      args: argsTextDelta ? parsePartialJson(argsTextDelta) : {}
    };
    contentParts = [...contentParts, contentPart];
  } else {
    const argsText = contentPart.argsText + argsTextDelta;
    contentPart = {
      ...contentPart,
      argsText,
      args: argsTextDelta ? parsePartialJson(argsText) : {}
    };
    contentParts = [
      ...contentParts.slice(0, contentPartIdx),
      contentPart,
      ...contentParts.slice(contentPartIdx + 1)
    ];
  }
  return {
    ...message,
    content: contentParts
  };
};
var appendOrUpdateToolResult = (message, toolCallId, toolName, result) => {
  let found = false;
  const newContentParts = message.content?.map((part) => {
    if (part.type !== "tool-call" || part.toolCallId !== toolCallId)
      return part;
    found = true;
    if (part.toolName !== toolName)
      throw new Error(
        `Tool call ${toolCallId} found with tool name ${part.toolName}, but expected ${toolName}`
      );
    return {
      ...part,
      result
    };
  });
  if (!found)
    throw new Error(
      `Received tool result for unknown tool call "${toolName}" / "${toolCallId}". This is likely an internal bug in assistant-ui.`
    );
  return {
    ...message,
    content: newContentParts
  };
};
var appendAnnotations = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_annotations: [
        ...message.metadata?.unstable_annotations ?? [],
        ...chunk.annotations
      ]
    }
  };
};
var appendData = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_data: [
        ...message.metadata?.unstable_data ?? [],
        ...chunk.data
      ]
    }
  };
};
var appendStepFinish = (message, chunk) => {
  const { type, ...rest } = chunk;
  const steps = [
    ...message.metadata?.steps ?? [],
    {
      usage: rest.usage
    }
  ];
  return {
    ...message,
    metadata: {
      ...message.metadata,
      steps
    }
  };
};
var appendOrUpdateFinish = (message, chunk) => {
  const { type, ...rest } = chunk;
  const steps = [
    ...message.metadata?.steps ?? [],
    {
      logprobs: rest.logprobs,
      usage: rest.usage
    }
  ];
  return {
    ...message,
    status: getStatus(chunk),
    metadata: {
      ...message.metadata,
      steps
    }
  };
};
var appendSource = (message, chunk) => {
  return {
    ...message,
    content: [
      ...message.content,
      {
        type: "source",
        ...chunk.source
      }
    ]
  };
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
var appendOrUpdateCancel = (message) => {
  return {
    ...message,
    status: {
      type: "incomplete",
      reason: "cancelled"
    }
  };
};
export {
  runResultStream
};
//# sourceMappingURL=runResultStream.mjs.map