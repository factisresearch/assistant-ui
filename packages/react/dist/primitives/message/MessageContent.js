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

// src/primitives/message/MessageContent.tsx
var MessageContent_exports = {};
__export(MessageContent_exports, {
  MessagePrimitiveContent: () => MessagePrimitiveContent
});
module.exports = __toCommonJS(MessageContent_exports);
var import_react = require("react");
var import_context = require("../../context/index.js");
var import_MessageContext = require("../../context/react/MessageContext.js");
var import_ContentPartRuntimeProvider = require("../../context/providers/ContentPartRuntimeProvider.js");
var import_ContentPartText = require("../contentPart/ContentPartText.js");
var import_ContentPartImage = require("../contentPart/ContentPartImage.js");
var import_ContentPartInProgress = require("../contentPart/ContentPartInProgress.js");
var import_jsx_runtime = require("react/jsx-runtime");
var ToolUIDisplay = ({
  Fallback,
  ...props
}) => {
  const Render = (0, import_context.useToolUIs)((s) => s.getToolUI(props.toolName)) ?? Fallback;
  if (!Render) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Render, { ...props });
};
var defaultComponents = {
  Text: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { whiteSpace: "pre-line" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ContentPartText.ContentPartPrimitiveText, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ContentPartInProgress.ContentPartPrimitiveInProgress, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontFamily: "revert" }, children: " \u25CF" }) })
  ] }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ContentPartImage.ContentPartPrimitiveImage, {}),
  File: () => null,
  Unstable_Audio: () => null
};
var MessageContentPartComponent = ({
  components: {
    Text = defaultComponents.Text,
    Reasoning = defaultComponents.Reasoning,
    Image = defaultComponents.Image,
    Source = defaultComponents.Source,
    File = defaultComponents.File,
    Unstable_Audio: Audio = defaultComponents.Unstable_Audio,
    tools = {}
  } = {}
}) => {
  const contentPartRuntime = (0, import_context.useContentPartRuntime)();
  const part = (0, import_context.useContentPart)();
  const type = part.type;
  if (type === "tool-call") {
    const addResult = (result) => contentPartRuntime.addToolResult(result);
    if ("Override" in tools)
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tools.Override, { ...part, addResult });
    const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolUIDisplay, { ...part, Fallback: Tool, addResult });
  }
  if (part.status.type === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (type) {
    case "text":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { ...part });
    case "reasoning":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reasoning, { ...part });
    case "source":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Source, { ...part });
    case "image":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { ...part });
    case "file":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { ...part });
    case "audio":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Audio, { ...part });
    default:
      const unhandledType = type;
      throw new Error(`Unknown content part type: ${unhandledType}`);
  }
};
var MessageContentPartImpl = ({
  partIndex,
  components
}) => {
  const messageRuntime = (0, import_MessageContext.useMessageRuntime)();
  const runtime = (0, import_react.useMemo)(
    () => messageRuntime.getContentPartByIndex(partIndex),
    [messageRuntime, partIndex]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ContentPartRuntimeProvider.ContentPartRuntimeProvider, { runtime, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageContentPartComponent, { components }) });
};
var MessageContentPart = (0, import_react.memo)(
  MessageContentPartImpl,
  (prev, next) => prev.partIndex === next.partIndex && prev.components?.Text === next.components?.Text && prev.components?.Reasoning === next.components?.Reasoning && prev.components?.Source === next.components?.Source && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.tools === next.components?.tools
);
var COMPLETE_STATUS = Object.freeze({
  type: "complete"
});
var EmptyContentFallback = ({ status, component: Component }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_context.TextContentPartProvider, { text: "", isRunning: status.type === "running", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, { type: "text", text: "", status }) });
};
var EmptyContentImpl = ({
  components
}) => {
  const status = (0, import_MessageContext.useMessage)((s) => s.status) ?? COMPLETE_STATUS;
  if (components?.Empty) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(components.Empty, { status });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    EmptyContentFallback,
    {
      status,
      component: components?.Text ?? defaultComponents.Text
    }
  );
};
var EmptyContent = (0, import_react.memo)(
  EmptyContentImpl,
  (prev, next) => prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text
);
var MessagePrimitiveContent = ({
  components
}) => {
  const contentLength = (0, import_MessageContext.useMessage)((s) => s.content.length);
  if (contentLength === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyContent, { components });
  }
  return Array.from({ length: contentLength }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageContentPart, { partIndex: index, components }, index));
};
MessagePrimitiveContent.displayName = "MessagePrimitive.Content";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessagePrimitiveContent
});
//# sourceMappingURL=MessageContent.js.map