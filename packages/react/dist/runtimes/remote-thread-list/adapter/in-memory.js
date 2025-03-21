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

// src/runtimes/remote-thread-list/adapter/in-memory.tsx
var in_memory_exports = {};
__export(in_memory_exports, {
  InMemoryThreadListAdapter: () => InMemoryThreadListAdapter
});
module.exports = __toCommonJS(in_memory_exports);
var InMemoryThreadListAdapter = class {
  list() {
    return Promise.resolve({
      threads: []
    });
  }
  rename() {
    return Promise.resolve();
  }
  archive() {
    return Promise.resolve();
  }
  unarchive() {
    return Promise.resolve();
  }
  delete() {
    return Promise.resolve();
  }
  initialize(threadId) {
    return Promise.resolve({ remoteId: threadId, externalId: void 0 });
  }
  generateTitle() {
    return Promise.resolve(new ReadableStream());
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryThreadListAdapter
});
//# sourceMappingURL=in-memory.js.map