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

// src/primitives/actionBar/ActionBarEdit.tsx
var ActionBarEdit_exports = {};
__export(ActionBarEdit_exports, {
  ActionBarPrimitiveEdit: () => ActionBarPrimitiveEdit
});
module.exports = __toCommonJS(ActionBarEdit_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_context = require("../../context/index.js");
var useActionBarEdit = () => {
  const messageRuntime = (0, import_context.useMessageRuntime)();
  const disabled = (0, import_context.useEditComposer)((c) => c.isEditing);
  const callback = (0, import_react.useCallback)(() => {
    messageRuntime.composer.beginEdit();
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var ActionBarPrimitiveEdit = (0, import_createActionButton.createActionButton)(
  "ActionBarPrimitive.Edit",
  useActionBarEdit
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionBarPrimitiveEdit
});
//# sourceMappingURL=ActionBarEdit.js.map