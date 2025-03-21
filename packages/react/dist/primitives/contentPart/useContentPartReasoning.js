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

// src/primitives/contentPart/useContentPartReasoning.tsx
var useContentPartReasoning_exports = {};
__export(useContentPartReasoning_exports, {
  useContentPartReasoning: () => useContentPartReasoning
});
module.exports = __toCommonJS(useContentPartReasoning_exports);
var import_ContentPartContext = require("../../context/react/ContentPartContext.js");
var useContentPartReasoning = () => {
  const text = (0, import_ContentPartContext.useContentPart)((c) => {
    if (c.type !== "reasoning")
      throw new Error(
        "ContentPartReasoning can only be used inside reasoning content parts."
      );
    return c;
  });
  return text;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useContentPartReasoning
});
//# sourceMappingURL=useContentPartReasoning.js.map