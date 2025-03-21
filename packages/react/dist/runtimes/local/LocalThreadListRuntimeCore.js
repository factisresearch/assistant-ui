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

// src/runtimes/local/LocalThreadListRuntimeCore.tsx
var LocalThreadListRuntimeCore_exports = {};
__export(LocalThreadListRuntimeCore_exports, {
  LocalThreadListRuntimeCore: () => LocalThreadListRuntimeCore
});
module.exports = __toCommonJS(LocalThreadListRuntimeCore_exports);
var import_BaseSubscribable = require("../remote-thread-list/BaseSubscribable.js");
var EMPTY_ARRAY = Object.freeze([]);
var LocalThreadListRuntimeCore = class extends import_BaseSubscribable.BaseSubscribable {
  _mainThread;
  constructor(_threadFactory) {
    super();
    this._mainThread = _threadFactory();
  }
  getMainThreadRuntimeCore() {
    return this._mainThread;
  }
  get newThreadId() {
    throw new Error("Method not implemented.");
  }
  get threadIds() {
    throw EMPTY_ARRAY;
  }
  get archivedThreadIds() {
    throw EMPTY_ARRAY;
  }
  get mainThreadId() {
    return "__DEFAULT_ID__";
  }
  getThreadRuntimeCore() {
    throw new Error("Method not implemented.");
  }
  getLoadThreadsPromise() {
    throw new Error("Method not implemented.");
  }
  getItemById(threadId) {
    if (threadId === this.mainThreadId) {
      return {
        status: "regular",
        threadId: this.mainThreadId,
        remoteId: this.mainThreadId,
        externalId: void 0,
        title: void 0,
        isMain: true
      };
    }
    throw new Error("Method not implemented");
  }
  async switchToThread() {
    throw new Error("Method not implemented.");
  }
  switchToNewThread() {
    throw new Error("Method not implemented.");
  }
  rename() {
    throw new Error("Method not implemented.");
  }
  archive() {
    throw new Error("Method not implemented.");
  }
  unarchive() {
    throw new Error("Method not implemented.");
  }
  delete() {
    throw new Error("Method not implemented.");
  }
  initialize() {
    throw new Error("Method not implemented.");
  }
  generateTitle() {
    throw new Error("Method not implemented.");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LocalThreadListRuntimeCore
});
//# sourceMappingURL=LocalThreadListRuntimeCore.js.map