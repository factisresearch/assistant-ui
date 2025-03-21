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

// src/runtimes/remote-thread-list/index.ts
var remote_thread_list_exports = {};
__export(remote_thread_list_exports, {
  unstable_InMemoryThreadListAdapter: () => import_in_memory.InMemoryThreadListAdapter,
  unstable_useRemoteThreadListRuntime: () => import_useRemoteThreadListRuntime.useRemoteThreadListRuntime
});
module.exports = __toCommonJS(remote_thread_list_exports);
var import_useRemoteThreadListRuntime = require("./useRemoteThreadListRuntime.js");
var import_in_memory = require("./adapter/in-memory.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unstable_InMemoryThreadListAdapter,
  unstable_useRemoteThreadListRuntime
});
//# sourceMappingURL=index.js.map