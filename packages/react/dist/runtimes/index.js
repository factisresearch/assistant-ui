"use strict";
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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/runtimes/index.ts
var runtimes_exports = {};
__export(runtimes_exports, {
  ExportedMessageRepository: () => import_MessageRepository.ExportedMessageRepository
});
module.exports = __toCommonJS(runtimes_exports);
__reExport(runtimes_exports, require("./adapters/index.js"), module.exports);
__reExport(runtimes_exports, require("./core/index.js"), module.exports);
__reExport(runtimes_exports, require("./dangerous-in-browser/index.js"), module.exports);
__reExport(runtimes_exports, require("./edge/index.js"), module.exports);
__reExport(runtimes_exports, require("./external-store/index.js"), module.exports);
__reExport(runtimes_exports, require("./local/index.js"), module.exports);
__reExport(runtimes_exports, require("./remote-thread-list/index.js"), module.exports);
var import_MessageRepository = require("./utils/MessageRepository.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExportedMessageRepository,
  ...require("./adapters/index.js"),
  ...require("./core/index.js"),
  ...require("./dangerous-in-browser/index.js"),
  ...require("./edge/index.js"),
  ...require("./external-store/index.js"),
  ...require("./local/index.js"),
  ...require("./remote-thread-list/index.js")
});
//# sourceMappingURL=index.js.map