"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/runtimes/adapters/index.ts
var adapters_exports = {};
module.exports = __toCommonJS(adapters_exports);
__reExport(adapters_exports, require("./attachment/index.js"), module.exports);
__reExport(adapters_exports, require("./feedback/index.js"), module.exports);
__reExport(adapters_exports, require("./speech/index.js"), module.exports);
__reExport(adapters_exports, require("./suggestion/index.js"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ...require("./attachment/index.js"),
  ...require("./feedback/index.js"),
  ...require("./speech/index.js"),
  ...require("./suggestion/index.js")
});
//# sourceMappingURL=index.js.map