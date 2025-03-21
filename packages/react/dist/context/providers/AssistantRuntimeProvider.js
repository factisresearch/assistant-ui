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

// src/context/providers/AssistantRuntimeProvider.tsx
var AssistantRuntimeProvider_exports = {};
__export(AssistantRuntimeProvider_exports, {
  AssistantRuntimeProvider: () => AssistantRuntimeProvider,
  AssistantRuntimeProviderImpl: () => AssistantRuntimeProviderImpl
});
module.exports = __toCommonJS(AssistantRuntimeProvider_exports);
var import_react = require("react");
var import_AssistantContext = require("../react/AssistantContext.js");
var import_AssistantToolUIs = require("../stores/AssistantToolUIs.js");
var import_ThreadRuntimeProvider = require("./ThreadRuntimeProvider.js");
var import_zustand = require("zustand");
var import_ReadonlyStore = require("../ReadonlyStore.js");
var import_ensureBinding = require("../react/utils/ensureBinding.js");
var import_jsx_runtime = require("react/jsx-runtime");
var useAssistantRuntimeStore = (runtime) => {
  const [store] = (0, import_react.useState)(() => (0, import_zustand.create)(() => runtime));
  (0, import_react.useEffect)(() => {
    (0, import_ensureBinding.ensureBinding)(runtime);
    (0, import_ensureBinding.ensureBinding)(runtime.threads);
    (0, import_ReadonlyStore.writableStore)(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var useAssistantToolUIsStore = () => {
  return (0, import_react.useMemo)(() => (0, import_AssistantToolUIs.makeAssistantToolUIsStore)(), []);
};
var getRenderComponent = (runtime) => {
  return runtime._core?.RenderComponent;
};
var AssistantRuntimeProviderImpl = ({ children, runtime }) => {
  const useAssistantRuntime = useAssistantRuntimeStore(runtime);
  const useToolUIs = useAssistantToolUIsStore();
  const [context] = (0, import_react.useState)(() => {
    return {
      useToolUIs,
      useAssistantRuntime
    };
  });
  const RenderComponent = getRenderComponent(runtime);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_AssistantContext.AssistantContext.Provider, { value: context, children: [
    RenderComponent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderComponent, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_ThreadRuntimeProvider.ThreadRuntimeProvider,
      {
        runtime: runtime.thread,
        listItemRuntime: runtime.threads.mainItem,
        children
      }
    )
  ] });
};
var AssistantRuntimeProvider = (0, import_react.memo)(AssistantRuntimeProviderImpl);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssistantRuntimeProvider,
  AssistantRuntimeProviderImpl
});
//# sourceMappingURL=AssistantRuntimeProvider.js.map