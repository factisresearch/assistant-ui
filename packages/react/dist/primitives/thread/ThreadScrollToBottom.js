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

// src/primitives/thread/ThreadScrollToBottom.tsx
var ThreadScrollToBottom_exports = {};
__export(ThreadScrollToBottom_exports, {
  ThreadPrimitiveScrollToBottom: () => ThreadPrimitiveScrollToBottom
});
module.exports = __toCommonJS(ThreadScrollToBottom_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_ThreadViewportContext = require("../../context/react/ThreadViewportContext.js");
var useThreadScrollToBottom = () => {
  const isAtBottom = (0, import_ThreadViewportContext.useThreadViewport)((s) => s.isAtBottom);
  const threadViewportStore = (0, import_ThreadViewportContext.useThreadViewportStore)();
  const handleScrollToBottom = (0, import_react.useCallback)(() => {
    threadViewportStore.getState().scrollToBottom();
  }, [threadViewportStore]);
  if (isAtBottom) return null;
  return handleScrollToBottom;
};
var ThreadPrimitiveScrollToBottom = (0, import_createActionButton.createActionButton)(
  "ThreadPrimitive.ScrollToBottom",
  useThreadScrollToBottom
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadPrimitiveScrollToBottom
});
//# sourceMappingURL=ThreadScrollToBottom.js.map