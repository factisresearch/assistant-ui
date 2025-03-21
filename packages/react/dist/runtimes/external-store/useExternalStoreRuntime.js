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

// src/runtimes/external-store/useExternalStoreRuntime.tsx
var useExternalStoreRuntime_exports = {};
__export(useExternalStoreRuntime_exports, {
  useExternalStoreRuntime: () => useExternalStoreRuntime
});
module.exports = __toCommonJS(useExternalStoreRuntime_exports);
var import_react = require("react");
var import_ExternalStoreRuntimeCore = require("./ExternalStoreRuntimeCore.js");
var import_AssistantRuntime = require("../../api/AssistantRuntime.js");
var import_RuntimeAdapterProvider = require("../adapters/RuntimeAdapterProvider.js");
var useExternalStoreRuntime = (store) => {
  const [runtime] = (0, import_react.useState)(() => new import_ExternalStoreRuntimeCore.ExternalStoreRuntimeCore(store));
  (0, import_react.useEffect)(() => {
    runtime.setAdapter(store);
  });
  const { modelContext } = (0, import_RuntimeAdapterProvider.useRuntimeAdapters)() ?? {};
  (0, import_react.useEffect)(() => {
    if (!modelContext) return void 0;
    return runtime.registerModelContextProvider(modelContext);
  }, [modelContext, runtime]);
  return (0, import_react.useMemo)(() => new import_AssistantRuntime.AssistantRuntimeImpl(runtime), [runtime]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useExternalStoreRuntime
});
//# sourceMappingURL=useExternalStoreRuntime.js.map