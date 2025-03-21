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

// src/runtimes/remote-thread-list/adapter/cloud.tsx
var cloud_exports = {};
__export(cloud_exports, {
  useCloudThreadListAdapter: () => useCloudThreadListAdapter
});
module.exports = __toCommonJS(cloud_exports);
var import_react = require("react");
var import_cloud = require("../../../cloud/index.js");
var import_AssistantCloudThreadHistoryAdapter = require("../../../cloud/AssistantCloudThreadHistoryAdapter.js");
var import_RuntimeAdapterProvider = require("../../adapters/RuntimeAdapterProvider.js");
var import_edge = require("../../edge/index.js");
var import_in_memory = require("./in-memory.js");
var import_jsx_runtime = require("react/jsx-runtime");
var baseUrl = typeof process !== "undefined" && process?.env?.["NEXT_PUBLIC_ASSISTANT_BASE_URL"];
var autoCloud = baseUrl ? new import_cloud.AssistantCloud({ baseUrl, anonymous: true }) : void 0;
var useCloudThreadListAdapter = (adapter) => {
  const adapterRef = (0, import_react.useRef)(adapter);
  (0, import_react.useEffect)(() => {
    adapterRef.current = adapter;
  }, [adapter]);
  const unstable_Provider = (0, import_react.useCallback)(
    function Provider({ children }) {
      const history = (0, import_AssistantCloudThreadHistoryAdapter.useAssistantCloudThreadHistoryAdapter)({
        get current() {
          return adapterRef.current.cloud ?? autoCloud;
        }
      });
      const adapters = (0, import_react.useMemo)(() => ({ history }), [history]);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_RuntimeAdapterProvider.RuntimeAdapterProvider, { adapters, children });
    },
    []
  );
  const cloud = adapter.cloud ?? autoCloud;
  if (!cloud) return new import_in_memory.InMemoryThreadListAdapter();
  return {
    list: async () => {
      const { threads } = await cloud.threads.list();
      return {
        threads: threads.map((t) => ({
          status: t.is_archived ? "archived" : "regular",
          remoteId: t.id,
          title: t.title,
          externalId: t.external_id ?? void 0
        }))
      };
    },
    initialize: async () => {
      const createTask = adapter.create?.() ?? Promise.resolve();
      const t = await createTask;
      const external_id = t ? t.externalId : void 0;
      const { thread_id: remoteId } = await cloud.threads.create({
        last_message_at: /* @__PURE__ */ new Date(),
        external_id
      });
      return { externalId: external_id, remoteId };
    },
    rename: async (threadId, newTitle) => {
      return cloud.threads.update(threadId, { title: newTitle });
    },
    archive: async (threadId) => {
      return cloud.threads.update(threadId, { is_archived: true });
    },
    unarchive: async (threadId) => {
      return cloud.threads.update(threadId, { is_archived: false });
    },
    delete: async (threadId) => {
      await adapter.delete?.(threadId);
      return cloud.threads.delete(threadId);
    },
    generateTitle: async (threadId, messages) => {
      return cloud.runs.stream({
        thread_id: threadId,
        assistant_id: "system/thread_title",
        messages: (0, import_edge.toCoreMessages)(messages)
      });
    },
    unstable_Provider
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCloudThreadListAdapter
});
//# sourceMappingURL=cloud.js.map