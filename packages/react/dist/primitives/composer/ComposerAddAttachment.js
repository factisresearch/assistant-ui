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

// src/primitives/composer/ComposerAddAttachment.tsx
var ComposerAddAttachment_exports = {};
__export(ComposerAddAttachment_exports, {
  ComposerPrimitiveAddAttachment: () => ComposerPrimitiveAddAttachment
});
module.exports = __toCommonJS(ComposerAddAttachment_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_context = require("../../context/index.js");
var useComposerAddAttachment = ({
  multiple = true
} = {}) => {
  const disabled = (0, import_context.useComposer)((c) => !c.isEditing);
  const composerRuntime = (0, import_context.useComposerRuntime)();
  const callback = (0, import_react.useCallback)(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    const attachmentAccept = composerRuntime.getAttachmentAccept();
    if (attachmentAccept !== "*") {
      input.accept = attachmentAccept;
    }
    input.onchange = (e) => {
      const fileList = e.target.files;
      if (!fileList) return;
      for (const file of fileList) {
        composerRuntime.addAttachment(file);
      }
    };
    input.click();
  }, [composerRuntime, multiple]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveAddAttachment = (0, import_createActionButton.createActionButton)(
  "ComposerPrimitive.AddAttachment",
  useComposerAddAttachment,
  ["multiple"]
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ComposerPrimitiveAddAttachment
});
//# sourceMappingURL=ComposerAddAttachment.js.map