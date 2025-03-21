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

// src/runtimes/external-store/getExternalStoreMessage.tsx
var getExternalStoreMessage_exports = {};
__export(getExternalStoreMessage_exports, {
  getExternalStoreMessage: () => getExternalStoreMessage,
  getExternalStoreMessages: () => getExternalStoreMessages,
  symbolInnerMessage: () => symbolInnerMessage
});
module.exports = __toCommonJS(getExternalStoreMessage_exports);
var symbolInnerMessage = Symbol("innerMessage");
var symbolInnerMessages = Symbol("innerMessages");
var getExternalStoreMessage = (input) => {
  const withInnerMessages = input;
  return withInnerMessages[symbolInnerMessage];
};
var EMPTY_ARRAY = [];
var getExternalStoreMessages = (input) => {
  const container = "messages" in input ? input.messages : input;
  const value = container[symbolInnerMessages] || container[symbolInnerMessage];
  if (!value) return EMPTY_ARRAY;
  if (Array.isArray(value)) {
    return value;
  }
  container[symbolInnerMessages] = [value];
  return container[symbolInnerMessages];
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExternalStoreMessage,
  getExternalStoreMessages,
  symbolInnerMessage
});
//# sourceMappingURL=getExternalStoreMessage.js.map