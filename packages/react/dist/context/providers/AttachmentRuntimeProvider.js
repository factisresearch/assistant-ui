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

// src/context/providers/AttachmentRuntimeProvider.tsx
var AttachmentRuntimeProvider_exports = {};
__export(AttachmentRuntimeProvider_exports, {
  AttachmentRuntimeProvider: () => AttachmentRuntimeProvider
});
module.exports = __toCommonJS(AttachmentRuntimeProvider_exports);
var import_react = require("react");
var import_zustand = require("zustand");
var import_AttachmentContext = require("../react/AttachmentContext.js");
var import_ReadonlyStore = require("../ReadonlyStore.js");
var import_ensureBinding = require("../react/utils/ensureBinding.js");
var import_jsx_runtime = require("react/jsx-runtime");
var useAttachmentRuntimeStore = (runtime) => {
  const [store] = (0, import_react.useState)(() => (0, import_zustand.create)(() => runtime));
  (0, import_react.useEffect)(() => {
    (0, import_ensureBinding.ensureBinding)(runtime);
    (0, import_ReadonlyStore.writableStore)(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var AttachmentRuntimeProvider = ({
  runtime,
  children
}) => {
  const useAttachmentRuntime = useAttachmentRuntimeStore(runtime);
  const [context] = (0, import_react.useState)(() => {
    return {
      useAttachmentRuntime
    };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_AttachmentContext.AttachmentContext.Provider, { value: context, children });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AttachmentRuntimeProvider
});
//# sourceMappingURL=AttachmentRuntimeProvider.js.map