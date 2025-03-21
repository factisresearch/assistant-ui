"use strict";
"use client";
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

// src/primitives/thread/ThreadSuggestion.tsx
var ThreadSuggestion_exports = {};
__export(ThreadSuggestion_exports, {
  ThreadPrimitiveSuggestion: () => ThreadPrimitiveSuggestion
});
module.exports = __toCommonJS(ThreadSuggestion_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_context = require("../../context/index.js");
var import_ThreadContext = require("../../context/react/ThreadContext.js");
var useThreadSuggestion = ({
  prompt,
  autoSend
}) => {
  const threadRuntime = (0, import_ThreadContext.useThreadRuntime)();
  const disabled = (0, import_context.useThread)((t) => t.isDisabled);
  const callback = (0, import_react.useCallback)(() => {
    if (autoSend && !threadRuntime.getState().isRunning) {
      threadRuntime.append(prompt);
    } else {
      threadRuntime.composer.setText(prompt);
    }
  }, [threadRuntime, autoSend, prompt]);
  if (disabled) return null;
  return callback;
};
var ThreadPrimitiveSuggestion = (0, import_createActionButton.createActionButton)(
  "ThreadPrimitive.Suggestion",
  useThreadSuggestion,
  ["prompt", "autoSend", "method"]
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadPrimitiveSuggestion
});
//# sourceMappingURL=ThreadSuggestion.js.map