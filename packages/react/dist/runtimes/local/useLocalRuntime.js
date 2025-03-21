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

// src/runtimes/local/useLocalRuntime.tsx
var useLocalRuntime_exports = {};
__export(useLocalRuntime_exports, {
  useLocalRuntime: () => useLocalRuntime
});
module.exports = __toCommonJS(useLocalRuntime_exports);
var import_react = require("react");
var import_LocalRuntimeCore = require("./LocalRuntimeCore.js");
var import_RuntimeAdapterProvider = require("../adapters/RuntimeAdapterProvider.js");
var import_useRemoteThreadListRuntime = require("../remote-thread-list/useRemoteThreadListRuntime.js");
var import_cloud = require("../remote-thread-list/adapter/cloud.js");
var import_internal = require("../../internal.js");
var useLocalThreadRuntime = (adapter, { initialMessages, ...options }) => {
  const { modelContext, ...threadListAdapters } = (0, import_RuntimeAdapterProvider.useRuntimeAdapters)() ?? {};
  const opt = (0, import_react.useMemo)(
    () => ({
      ...options,
      adapters: {
        ...threadListAdapters,
        ...options.adapters,
        chatModel: adapter
      }
    }),
    [adapter, options, threadListAdapters]
  );
  const [runtime] = (0, import_react.useState)(() => new import_LocalRuntimeCore.LocalRuntimeCore(opt, initialMessages));
  (0, import_react.useEffect)(() => {
    runtime.threads.getMainThreadRuntimeCore().__internal_setOptions(opt);
    runtime.threads.getMainThreadRuntimeCore().__internal_load();
  }, [runtime, opt]);
  (0, import_react.useEffect)(() => {
    if (!modelContext) return void 0;
    return runtime.registerModelContextProvider(modelContext);
  }, [modelContext, runtime]);
  return (0, import_react.useMemo)(() => new import_internal.AssistantRuntimeImpl(runtime), [runtime]);
};
var useLocalRuntime = (adapter, { cloud, ...options } = {}) => {
  const cloudAdapter = (0, import_cloud.useCloudThreadListAdapter)({ cloud });
  return (0, import_useRemoteThreadListRuntime.useRemoteThreadListRuntime)({
    runtimeHook: function RuntimeHook() {
      return useLocalThreadRuntime(adapter, options);
    },
    adapter: cloudAdapter
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useLocalRuntime
});
//# sourceMappingURL=useLocalRuntime.js.map