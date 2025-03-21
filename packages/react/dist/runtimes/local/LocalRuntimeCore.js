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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/runtimes/local/LocalRuntimeCore.tsx
var LocalRuntimeCore_exports = {};
__export(LocalRuntimeCore_exports, {
  LocalRuntimeCore: () => LocalRuntimeCore
});
module.exports = __toCommonJS(LocalRuntimeCore_exports);
var import_BaseAssistantRuntimeCore = require("../core/BaseAssistantRuntimeCore.js");
var import_LocalThreadRuntimeCore = require("./LocalThreadRuntimeCore.js");
var import_LocalThreadListRuntimeCore = require("./LocalThreadListRuntimeCore.js");
var import_MessageRepository = require("../utils/MessageRepository.js");
var LocalRuntimeCore = class extends import_BaseAssistantRuntimeCore.BaseAssistantRuntimeCore {
  threads;
  Provider = void 0;
  _options;
  constructor(options, initialMessages) {
    super();
    this._options = options;
    this.threads = new import_LocalThreadListRuntimeCore.LocalThreadListRuntimeCore(() => {
      return new import_LocalThreadRuntimeCore.LocalThreadRuntimeCore(this._contextProvider, this._options);
    });
    if (initialMessages) {
      this.threads.getMainThreadRuntimeCore().import(import_MessageRepository.ExportedMessageRepository.fromArray(initialMessages));
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LocalRuntimeCore
});
//# sourceMappingURL=LocalRuntimeCore.js.map