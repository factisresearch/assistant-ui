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

// src/cloud/auiV0.ts
var auiV0_exports = {};
__export(auiV0_exports, {
  auiV0Decode: () => auiV0Decode,
  auiV0Encode: () => auiV0Encode
});
module.exports = __toCommonJS(auiV0_exports);
var import_ThreadMessageLike = require("../runtimes/external-store/ThreadMessageLike.js");
var import_is_json = require("../utils/json/is-json.js");
var auiV0Encode = (message) => {
  return {
    role: message.role,
    content: message.content.map((part) => {
      const type = part.type;
      switch (type) {
        case "text": {
          return {
            type: "text",
            text: part.text
          };
        }
        case "reasoning": {
          return {
            type: "reasoning",
            text: part.text
          };
        }
        case "source":
          return part;
        case "tool-call": {
          if (!(0, import_is_json.isJSONValue)(part.result)) {
            console.warn(
              "tool-call result is not JSON! " + JSON.stringify(part)
            );
          }
          return {
            type: "tool-call",
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            ...JSON.stringify(part.args) === part.argsText ? {
              args: part.args
            } : { argsText: part.argsText },
            ...part.result ? { result: part.result } : {},
            ...part.isError ? { isError: true } : {}
          };
        }
        default: {
          const unhandledType = type;
          throw new Error(
            `Content part type not supported by aui/v0: ${unhandledType}`
          );
        }
      }
    }),
    metadata: message.metadata,
    ...message.status ? {
      status: message.status?.type === "running" ? {
        type: "incomplete",
        reason: "cancelled"
      } : message.status
    } : void 0
  };
};
var auiV0Decode = (cloudMessage) => {
  const payload = cloudMessage.content;
  const message = (0, import_ThreadMessageLike.fromThreadMessageLike)(
    {
      id: cloudMessage.id,
      createdAt: cloudMessage.created_at,
      ...payload
    },
    cloudMessage.id,
    {
      type: "complete",
      reason: "unknown"
    }
  );
  return {
    parentId: cloudMessage.parent_id,
    message
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  auiV0Decode,
  auiV0Encode
});
//# sourceMappingURL=auiV0.js.map