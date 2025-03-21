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

// src/primitives/branchPicker/BranchPickerNext.tsx
var BranchPickerNext_exports = {};
__export(BranchPickerNext_exports, {
  BranchPickerPrimitiveNext: () => BranchPickerPrimitiveNext
});
module.exports = __toCommonJS(BranchPickerNext_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_MessageContext = require("../../context/react/MessageContext.js");
var useBranchPickerNext = () => {
  const messageRuntime = (0, import_MessageContext.useMessageRuntime)();
  const disabled = (0, import_MessageContext.useMessage)((m) => m.branchNumber >= m.branchCount);
  const callback = (0, import_react.useCallback)(() => {
    messageRuntime.switchToBranch({ position: "next" });
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var BranchPickerPrimitiveNext = (0, import_createActionButton.createActionButton)(
  "BranchPickerPrimitive.Next",
  useBranchPickerNext
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BranchPickerPrimitiveNext
});
//# sourceMappingURL=BranchPickerNext.js.map