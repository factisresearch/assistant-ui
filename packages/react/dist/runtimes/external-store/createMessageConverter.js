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

// src/runtimes/external-store/createMessageConverter.tsx
var createMessageConverter_exports = {};
__export(createMessageConverter_exports, {
  createMessageConverter: () => createMessageConverter
});
module.exports = __toCommonJS(createMessageConverter_exports);
var import_context = require("../../context/index.js");
var import_external_message_converter = require("./external-message-converter.js");
var import_getExternalStoreMessage = require("./getExternalStoreMessage.js");
var createMessageConverter = (callback) => {
  const result = {
    useThreadMessages: (messages, isRunning) => {
      return (0, import_external_message_converter.useExternalMessageConverter)({
        callback,
        messages,
        isRunning
      });
    },
    toThreadMessages: (messages) => {
      return (0, import_external_message_converter.convertExternalMessages)(messages, callback, false);
    },
    toOriginalMessages: (input) => {
      const messages = (0, import_getExternalStoreMessage.getExternalStoreMessages)(input);
      if (messages.length === 0) throw new Error("No original messages found");
      return messages;
    },
    toOriginalMessage: (input) => {
      const messages = result.toOriginalMessages(input);
      return messages[0];
    },
    useOriginalMessage: () => {
      const messageMessages = result.useOriginalMessages();
      const first = messageMessages[0];
      return first;
    },
    useOriginalMessages: () => {
      const contentPartMessages = (0, import_context.useContentPart)({
        optional: true,
        selector: import_getExternalStoreMessage.getExternalStoreMessages
      });
      const messageMessages = (0, import_context.useMessage)(import_getExternalStoreMessage.getExternalStoreMessages);
      const messages = contentPartMessages ?? messageMessages;
      if (messages.length === 0) throw new Error("No original messages found");
      return messages;
    }
  };
  return result;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMessageConverter
});
//# sourceMappingURL=createMessageConverter.js.map