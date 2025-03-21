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

// src/context/react/ThreadContext.ts
var ThreadContext_exports = {};
__export(ThreadContext_exports, {
  ThreadContext: () => ThreadContext,
  useThread: () => useThread,
  useThreadComposer: () => useThreadComposer,
  useThreadModelContext: () => useThreadModelContext,
  useThreadRuntime: () => useThreadRuntime
});
module.exports = __toCommonJS(ThreadContext_exports);
var import_react = require("react");
var import_createContextHook = require("./utils/createContextHook.js");
var import_createStateHookForRuntime = require("./utils/createStateHookForRuntime.js");
var ThreadContext = (0, import_react.createContext)(null);
var useThreadContext = (0, import_createContextHook.createContextHook)(
  ThreadContext,
  "AssistantRuntimeProvider"
);
function useThreadRuntime(options) {
  const context = useThreadContext(options);
  if (!context) return null;
  return context.useThreadRuntime();
}
var useThread = (0, import_createStateHookForRuntime.createStateHookForRuntime)(useThreadRuntime);
var useThreadComposerRuntime = (opt) => useThreadRuntime(opt)?.composer ?? null;
var useThreadComposer = (0, import_createStateHookForRuntime.createStateHookForRuntime)(
  useThreadComposerRuntime
);
function useThreadModelContext(options) {
  const [, rerender] = (0, import_react.useState)({});
  const runtime = useThreadRuntime(options);
  (0, import_react.useEffect)(() => {
    return runtime?.unstable_on("model-context-update", () => rerender({}));
  }, [runtime]);
  if (!runtime) return null;
  return runtime?.getModelContext();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadContext,
  useThread,
  useThreadComposer,
  useThreadModelContext,
  useThreadRuntime
});
//# sourceMappingURL=ThreadContext.js.map