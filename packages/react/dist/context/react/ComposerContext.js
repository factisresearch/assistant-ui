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

// src/context/react/ComposerContext.ts
var ComposerContext_exports = {};
__export(ComposerContext_exports, {
  useComposer: () => useComposer,
  useComposerRuntime: () => useComposerRuntime
});
module.exports = __toCommonJS(ComposerContext_exports);
var import_MessageContext = require("./MessageContext.js");
var import_ThreadContext = require("./ThreadContext.js");
var import_createStateHookForRuntime = require("./utils/createStateHookForRuntime.js");
function useComposerRuntime(options) {
  const messageRuntime = (0, import_MessageContext.useMessageRuntime)({ optional: true });
  const threadRuntime = (0, import_ThreadContext.useThreadRuntime)(options);
  return messageRuntime ? messageRuntime.composer : threadRuntime?.composer ?? null;
}
var useComposer = (0, import_createStateHookForRuntime.createStateHookForRuntime)(useComposerRuntime);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useComposer,
  useComposerRuntime
});
//# sourceMappingURL=ComposerContext.js.map