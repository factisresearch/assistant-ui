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

// src/primitives/branchPicker/BranchPickerPrevious.tsx
var BranchPickerPrevious_exports = {};
__export(BranchPickerPrevious_exports, {
  BranchPickerPrimitivePrevious: () => BranchPickerPrimitivePrevious
});
module.exports = __toCommonJS(BranchPickerPrevious_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_MessageContext = require("../../context/react/MessageContext.js");
var useBranchPickerPrevious = () => {
  const messageRuntime = (0, import_MessageContext.useMessageRuntime)();
  const disabled = (0, import_MessageContext.useMessage)((m) => m.branchNumber <= 1);
  const callback = (0, import_react.useCallback)(() => {
    messageRuntime.switchToBranch({ position: "previous" });
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var BranchPickerPrimitivePrevious = (0, import_createActionButton.createActionButton)(
  "BranchPickerPrimitive.Previous",
  useBranchPickerPrevious
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BranchPickerPrimitivePrevious
});
//# sourceMappingURL=BranchPickerPrevious.js.map