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

// src/context/react/utils/createStateHookForRuntime.ts
var createStateHookForRuntime_exports = {};
__export(createStateHookForRuntime_exports, {
  createStateHookForRuntime: () => createStateHookForRuntime
});
module.exports = __toCommonJS(createStateHookForRuntime_exports);
var import_useRuntimeState = require("./useRuntimeState.js");
function createStateHookForRuntime(useRuntime) {
  function useStoreHook(param) {
    let optional = false;
    let selector;
    if (typeof param === "function") {
      selector = param;
    } else if (param) {
      optional = !!param.optional;
      selector = param.selector;
    }
    const store = useRuntime({ optional });
    if (!store) return null;
    return (0, import_useRuntimeState.useRuntimeStateInternal)(store, selector);
  }
  return useStoreHook;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createStateHookForRuntime
});
//# sourceMappingURL=createStateHookForRuntime.js.map