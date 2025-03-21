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

// src/context/react/ThreadViewportContext.ts
var ThreadViewportContext_exports = {};
__export(ThreadViewportContext_exports, {
  ThreadViewportContext: () => ThreadViewportContext,
  useThreadViewport: () => useThreadViewport,
  useThreadViewportStore: () => useThreadViewportStore
});
module.exports = __toCommonJS(ThreadViewportContext_exports);
var import_react = require("react");
var import_createContextHook = require("./utils/createContextHook.js");
var import_createContextStoreHook = require("./utils/createContextStoreHook.js");
var ThreadViewportContext = (0, import_react.createContext)(null);
var useThreadViewportContext = (0, import_createContextHook.createContextHook)(
  ThreadViewportContext,
  "ThreadPrimitive.Viewport"
);
var { useThreadViewport, useThreadViewportStore } = (0, import_createContextStoreHook.createContextStoreHook)(useThreadViewportContext, "useThreadViewport");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadViewportContext,
  useThreadViewport,
  useThreadViewportStore
});
//# sourceMappingURL=ThreadViewportContext.js.map