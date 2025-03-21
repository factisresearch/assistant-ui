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

// src/context/providers/ThreadViewportProvider.tsx
var ThreadViewportProvider_exports = {};
__export(ThreadViewportProvider_exports, {
  ThreadViewportProvider: () => ThreadViewportProvider
});
module.exports = __toCommonJS(ThreadViewportProvider_exports);
var import_react = require("react");
var import_ThreadViewport = require("../stores/ThreadViewport.js");
var import_ThreadViewportContext = require("../react/ThreadViewportContext.js");
var import_ReadonlyStore = require("../ReadonlyStore.js");
var import_jsx_runtime = require("react/jsx-runtime");
var useThreadViewportStoreValue = () => {
  const outerViewport = (0, import_ThreadViewportContext.useThreadViewportStore)({ optional: true });
  const [store] = (0, import_react.useState)(() => (0, import_ThreadViewport.makeThreadViewportStore)());
  (0, import_react.useEffect)(() => {
    return outerViewport?.getState().onScrollToBottom(() => {
      store.getState().scrollToBottom();
    });
  }, [outerViewport, store]);
  (0, import_react.useEffect)(() => {
    if (!outerViewport) return;
    return store.subscribe((state) => {
      if (outerViewport.getState().isAtBottom !== state.isAtBottom) {
        (0, import_ReadonlyStore.writableStore)(outerViewport).setState({ isAtBottom: state.isAtBottom });
      }
    });
  }, [store, outerViewport]);
  return store;
};
var ThreadViewportProvider = ({ children }) => {
  const useThreadViewport = useThreadViewportStoreValue();
  const [context] = (0, import_react.useState)(() => {
    return {
      useThreadViewport
    };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_ThreadViewportContext.ThreadViewportContext.Provider, { value: context, children });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadViewportProvider
});
//# sourceMappingURL=ThreadViewportProvider.js.map