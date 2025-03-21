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

// src/primitives/actionBar/ActionBarSpeak.tsx
var ActionBarSpeak_exports = {};
__export(ActionBarSpeak_exports, {
  ActionBarPrimitiveSpeak: () => ActionBarPrimitiveSpeak
});
module.exports = __toCommonJS(ActionBarSpeak_exports);
var import_react = require("react");
var import_context = require("../../context/index.js");
var import_createActionButton = require("../../utils/createActionButton.js");
var useActionBarSpeak = () => {
  const messageRuntime = (0, import_context.useMessageRuntime)();
  const callback = (0, import_react.useCallback)(async () => {
    messageRuntime.speak();
  }, [messageRuntime]);
  const hasSpeakableContent = (0, import_context.useMessage)((m) => {
    return (m.role !== "assistant" || m.status.type !== "running") && m.content.some((c) => c.type === "text" && c.text.length > 0);
  });
  if (!hasSpeakableContent) return null;
  return callback;
};
var ActionBarPrimitiveSpeak = (0, import_createActionButton.createActionButton)(
  "ActionBarPrimitive.Speak",
  useActionBarSpeak
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionBarPrimitiveSpeak
});
//# sourceMappingURL=ActionBarSpeak.js.map