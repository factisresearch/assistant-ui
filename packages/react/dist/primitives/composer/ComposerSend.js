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

// src/primitives/composer/ComposerSend.tsx
var ComposerSend_exports = {};
__export(ComposerSend_exports, {
  ComposerPrimitiveSend: () => ComposerPrimitiveSend,
  useComposerSend: () => useComposerSend
});
module.exports = __toCommonJS(ComposerSend_exports);
var import_createActionButton = require("../../utils/createActionButton.js");
var import_react = require("react");
var import_useCombinedStore = require("../../utils/combined/useCombinedStore.js");
var import_ThreadContext = require("../../context/react/ThreadContext.js");
var import_context = require("../../context/index.js");
var useComposerSend = () => {
  const composerRuntime = (0, import_context.useComposerRuntime)();
  const threadRuntime = (0, import_ThreadContext.useThreadRuntime)();
  const disabled = (0, import_useCombinedStore.useCombinedStore)(
    [threadRuntime, composerRuntime],
    (t, c) => t.isRunning || !c.isEditing || c.isEmpty
  );
  const callback = (0, import_react.useCallback)(() => {
    composerRuntime.send();
  }, [composerRuntime]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveSend = (0, import_createActionButton.createActionButton)(
  "ComposerPrimitive.Send",
  useComposerSend
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ComposerPrimitiveSend,
  useComposerSend
});
//# sourceMappingURL=ComposerSend.js.map