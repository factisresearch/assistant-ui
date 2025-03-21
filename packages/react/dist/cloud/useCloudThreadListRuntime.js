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

// src/cloud/useCloudThreadListRuntime.tsx
var useCloudThreadListRuntime_exports = {};
__export(useCloudThreadListRuntime_exports, {
  useCloudThreadListRuntime: () => useCloudThreadListRuntime
});
module.exports = __toCommonJS(useCloudThreadListRuntime_exports);
var import_useRemoteThreadListRuntime = require("../runtimes/remote-thread-list/useRemoteThreadListRuntime.js");
var import_cloud = require("../runtimes/remote-thread-list/adapter/cloud.js");
var useCloudThreadListRuntime = ({
  runtimeHook,
  ...adapterOptions
}) => {
  const adapter = (0, import_cloud.useCloudThreadListAdapter)(adapterOptions);
  const runtime = (0, import_useRemoteThreadListRuntime.useRemoteThreadListRuntime)({
    runtimeHook,
    adapter
  });
  return runtime;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCloudThreadListRuntime
});
//# sourceMappingURL=useCloudThreadListRuntime.js.map