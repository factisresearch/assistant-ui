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

// src/primitives/actionBar/ActionBarReload.tsx
var ActionBarReload_exports = {};
__export(ActionBarReload_exports, {
  ActionBarPrimitiveReload: () => ActionBarPrimitiveReload
});
module.exports = __toCommonJS(ActionBarReload_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_context = require("../../context/index.js");
var import_ThreadContext = require("../../context/react/ThreadContext.js");
var import_useCombinedStore = require("../../utils/combined/useCombinedStore.js");
var useActionBarReload = () => {
  const messageRuntime = (0, import_context.useMessageRuntime)();
  const threadRuntime = (0, import_ThreadContext.useThreadRuntime)();
  const disabled = (0, import_useCombinedStore.useCombinedStore)(
    [threadRuntime, messageRuntime],
    (t, m) => t.isRunning || t.isDisabled || m.role !== "assistant"
  );
  const callback = (0, import_react.useCallback)(() => {
    messageRuntime.reload();
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var ActionBarPrimitiveReload = (0, import_createActionButton.createActionButton)(
  "ActionBarPrimitive.Reload",
  useActionBarReload
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionBarPrimitiveReload
});
//# sourceMappingURL=ActionBarReload.js.map