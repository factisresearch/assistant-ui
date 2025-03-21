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

// src/cloud/AssistantCloudThreadHistoryAdapter.tsx
var AssistantCloudThreadHistoryAdapter_exports = {};
__export(AssistantCloudThreadHistoryAdapter_exports, {
  useAssistantCloudThreadHistoryAdapter: () => useAssistantCloudThreadHistoryAdapter
});
module.exports = __toCommonJS(AssistantCloudThreadHistoryAdapter_exports);
var import_react = require("react");
var import_context = require("../context/index.js");
var import_auiV0 = require("./auiV0.js");
var AssistantCloudThreadHistoryAdapter = class {
  constructor(cloudRef, threadListItemRuntime) {
    this.cloudRef = cloudRef;
    this.threadListItemRuntime = threadListItemRuntime;
  }
  _getIdForLocalId = {};
  async append({ parentId, message }) {
    const { remoteId } = await this.threadListItemRuntime.initialize();
    const task = this.cloudRef.current.threads.messages.create(remoteId, {
      parent_id: parentId ? await this._getIdForLocalId[parentId] ?? parentId : null,
      format: "aui/v0",
      content: (0, import_auiV0.auiV0Encode)(message)
    }).then(({ message_id }) => {
      this._getIdForLocalId[message.id] = message_id;
      return message_id;
    });
    this._getIdForLocalId[message.id] = task;
    return task.then(() => {
    });
  }
  async load() {
    const remoteId = this.threadListItemRuntime.getState().remoteId;
    if (!remoteId) return { messages: [] };
    const { messages } = await this.cloudRef.current.threads.messages.list(remoteId);
    const payload = {
      messages: messages.filter(
        (m) => m.format === "aui/v0"
      ).map(import_auiV0.auiV0Decode).reverse()
    };
    return payload;
  }
};
var useAssistantCloudThreadHistoryAdapter = (cloudRef) => {
  const threadListItemRuntime = (0, import_context.useThreadListItemRuntime)();
  const [adapter] = (0, import_react.useState)(
    () => new AssistantCloudThreadHistoryAdapter(cloudRef, threadListItemRuntime)
  );
  return adapter;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAssistantCloudThreadHistoryAdapter
});
//# sourceMappingURL=AssistantCloudThreadHistoryAdapter.js.map