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

// src/runtimes/remote-thread-list/useRemoteThreadListRuntime.tsx
var useRemoteThreadListRuntime_exports = {};
__export(useRemoteThreadListRuntime_exports, {
  useRemoteThreadListRuntime: () => useRemoteThreadListRuntime
});
module.exports = __toCommonJS(useRemoteThreadListRuntime_exports);
var import_react = require("react");
var import_BaseAssistantRuntimeCore = require("../core/BaseAssistantRuntimeCore.js");
var import_RemoteThreadListThreadListRuntimeCore = require("./RemoteThreadListThreadListRuntimeCore.js");
var import_internal = require("../../internal.js");
var RemoteThreadListRuntimeCore = class extends import_BaseAssistantRuntimeCore.BaseAssistantRuntimeCore {
  threads;
  constructor(options) {
    super();
    this.threads = new import_RemoteThreadListThreadListRuntimeCore.RemoteThreadListThreadListRuntimeCore(
      options,
      this._contextProvider
    );
  }
  get RenderComponent() {
    return this.threads.__internal_RenderComponent;
  }
};
var useRemoteThreadListRuntime = (options) => {
  const [runtime] = (0, import_react.useState)(() => new RemoteThreadListRuntimeCore(options));
  (0, import_react.useEffect)(() => {
    runtime.threads.__internal_setOptions(options);
    runtime.threads.__internal_load();
  }, [runtime, options]);
  return (0, import_react.useMemo)(() => new import_internal.AssistantRuntimeImpl(runtime), [runtime]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRemoteThreadListRuntime
});
//# sourceMappingURL=useRemoteThreadListRuntime.js.map