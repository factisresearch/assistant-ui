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

// src/primitives/actionBar/ActionBarCopy.tsx
var ActionBarCopy_exports = {};
__export(ActionBarCopy_exports, {
  ActionBarPrimitiveCopy: () => ActionBarPrimitiveCopy
});
module.exports = __toCommonJS(ActionBarCopy_exports);
var import_react = require("react");
var import_primitive = require("@radix-ui/primitive");
var import_react_primitive = require("@radix-ui/react-primitive");
var import_context = require("../../context/index.js");
var import_react2 = require("react");
var import_MessageContext = require("../../context/react/MessageContext.js");
var import_context2 = require("../../context/index.js");
var import_jsx_runtime = require("react/jsx-runtime");
var useActionBarPrimitiveCopy = ({
  copiedDuration = 3e3
} = {}) => {
  const messageRuntime = (0, import_MessageContext.useMessageRuntime)();
  const composerRuntime = (0, import_context2.useComposerRuntime)();
  const setIsCopied = (0, import_context.useMessageUtils)((s) => s.setIsCopied);
  const hasCopyableContent = (0, import_MessageContext.useMessage)((message) => {
    return (message.role !== "assistant" || message.status.type !== "running") && message.content.some((c) => c.type === "text" && c.text.length > 0);
  });
  const callback = (0, import_react2.useCallback)(() => {
    const { isEditing, text: composerValue } = composerRuntime.getState();
    const valueToCopy = isEditing ? composerValue : messageRuntime.unstable_getCopyText();
    navigator.clipboard.writeText(valueToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  }, [messageRuntime, setIsCopied, composerRuntime, copiedDuration]);
  if (!hasCopyableContent) return null;
  return callback;
};
var ActionBarPrimitiveCopy = (0, import_react.forwardRef)(({ copiedDuration, onClick, disabled, ...props }, forwardedRef) => {
  const isCopied = (0, import_context.useMessageUtils)((u) => u.isCopied);
  const callback = useActionBarPrimitiveCopy({ copiedDuration });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_primitive.Primitive.button,
    {
      type: "button",
      ...isCopied ? { "data-copied": "true" } : {},
      ...props,
      ref: forwardedRef,
      disabled: disabled || !callback,
      onClick: (0, import_primitive.composeEventHandlers)(onClick, () => {
        callback?.();
      })
    }
  );
});
ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionBarPrimitiveCopy
});
//# sourceMappingURL=ActionBarCopy.js.map