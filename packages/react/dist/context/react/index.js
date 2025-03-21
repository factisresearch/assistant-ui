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

// src/context/react/index.ts
var react_exports = {};
__export(react_exports, {
  useAssistantRuntime: () => import_AssistantContext.useAssistantRuntime,
  useAttachment: () => import_AttachmentContext.useAttachment,
  useAttachmentRuntime: () => import_AttachmentContext.useAttachmentRuntime,
  useComposer: () => import_ComposerContext.useComposer,
  useComposerRuntime: () => import_ComposerContext.useComposerRuntime,
  useContentPart: () => import_ContentPartContext.useContentPart,
  useContentPartRuntime: () => import_ContentPartContext.useContentPartRuntime,
  useEditComposer: () => import_MessageContext.useEditComposer,
  useMessage: () => import_MessageContext.useMessage,
  useMessageRuntime: () => import_MessageContext.useMessageRuntime,
  useMessageUtils: () => import_MessageContext.useMessageUtils,
  useMessageUtilsStore: () => import_MessageContext.useMessageUtilsStore,
  useRuntimeState: () => import_useRuntimeState.useRuntimeState,
  useThread: () => import_ThreadContext.useThread,
  useThreadComposer: () => import_ThreadContext.useThreadComposer,
  useThreadList: () => import_AssistantContext.useThreadList,
  useThreadListItem: () => import_ThreadListItemContext.useThreadListItem,
  useThreadListItemRuntime: () => import_ThreadListItemContext.useThreadListItemRuntime,
  useThreadModelConfig: () => import_ThreadContext.useThreadModelContext,
  useThreadModelContext: () => import_ThreadContext.useThreadModelContext,
  useThreadRuntime: () => import_ThreadContext.useThreadRuntime,
  useThreadViewport: () => import_ThreadViewportContext.useThreadViewport,
  useThreadViewportStore: () => import_ThreadViewportContext.useThreadViewportStore,
  useToolUIs: () => import_AssistantContext.useToolUIs,
  useToolUIsStore: () => import_AssistantContext.useToolUIsStore
});
module.exports = __toCommonJS(react_exports);
var import_AssistantContext = require("./AssistantContext.js");
var import_ThreadContext = require("./ThreadContext.js");
var import_ThreadViewportContext = require("./ThreadViewportContext.js");
var import_ThreadListItemContext = require("./ThreadListItemContext.js");
var import_MessageContext = require("./MessageContext.js");
var import_ContentPartContext = require("./ContentPartContext.js");
var import_ComposerContext = require("./ComposerContext.js");
var import_AttachmentContext = require("./AttachmentContext.js");
var import_useRuntimeState = require("./utils/useRuntimeState.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAssistantRuntime,
  useAttachment,
  useAttachmentRuntime,
  useComposer,
  useComposerRuntime,
  useContentPart,
  useContentPartRuntime,
  useEditComposer,
  useMessage,
  useMessageRuntime,
  useMessageUtils,
  useMessageUtilsStore,
  useRuntimeState,
  useThread,
  useThreadComposer,
  useThreadList,
  useThreadListItem,
  useThreadListItemRuntime,
  useThreadModelConfig,
  useThreadModelContext,
  useThreadRuntime,
  useThreadViewport,
  useThreadViewportStore,
  useToolUIs,
  useToolUIsStore
});
//# sourceMappingURL=index.js.map