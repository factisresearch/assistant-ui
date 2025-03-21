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

// src/api/AssistantRuntime.ts
var AssistantRuntime_exports = {};
__export(AssistantRuntime_exports, {
  AssistantRuntimeImpl: () => AssistantRuntimeImpl
});
module.exports = __toCommonJS(AssistantRuntime_exports);
var import_ThreadListRuntime = require("./ThreadListRuntime.js");
var import_runtimes = require("../runtimes/index.js");
var AssistantRuntimeImpl = class {
  constructor(_core) {
    this._core = _core;
    this.threads = new import_ThreadListRuntime.ThreadListRuntimeImpl(_core.threads);
    this._thread = this.threads.main;
  }
  threads;
  get threadList() {
    return this.threads;
  }
  _thread;
  __internal_bindMethods() {
    this.switchToNewThread = this.switchToNewThread.bind(this);
    this.switchToThread = this.switchToThread.bind(this);
    this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
    this.registerModelConfigProvider = this.registerModelConfigProvider.bind(this);
    this.reset = this.reset.bind(this);
  }
  get thread() {
    return this._thread;
  }
  switchToNewThread() {
    return this._core.threads.switchToNewThread();
  }
  switchToThread(threadId) {
    return this._core.threads.switchToThread(threadId);
  }
  registerModelContextProvider(provider) {
    return this._core.registerModelContextProvider(provider);
  }
  registerModelConfigProvider(provider) {
    return this.registerModelContextProvider(provider);
  }
  reset({
    initialMessages
  } = {}) {
    return this._core.threads.getMainThreadRuntimeCore().import(import_runtimes.ExportedMessageRepository.fromArray(initialMessages ?? []));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssistantRuntimeImpl
});
//# sourceMappingURL=AssistantRuntime.js.map