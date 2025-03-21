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

// src/api/ThreadListRuntime.ts
var ThreadListRuntime_exports = {};
__export(ThreadListRuntime_exports, {
  ThreadListRuntimeImpl: () => ThreadListRuntimeImpl
});
module.exports = __toCommonJS(ThreadListRuntime_exports);
var import_LazyMemoizeSubject = require("./subscribable/LazyMemoizeSubject.js");
var import_ThreadListItemRuntime = require("./ThreadListItemRuntime.js");
var import_SKIP_UPDATE = require("./subscribable/SKIP_UPDATE.js");
var import_ShallowMemoizeSubject = require("./subscribable/ShallowMemoizeSubject.js");
var import_ThreadRuntime = require("./ThreadRuntime.js");
var import_NestedSubscriptionSubject = require("./subscribable/NestedSubscriptionSubject.js");
var getThreadListState = (threadList) => {
  return {
    mainThreadId: threadList.mainThreadId,
    newThread: threadList.newThreadId,
    threads: threadList.threadIds,
    archivedThreads: threadList.archivedThreadIds
  };
};
var getThreadListItemState = (threadList, threadId) => {
  if (threadId === void 0) return import_SKIP_UPDATE.SKIP_UPDATE;
  const threadData = threadList.getItemById(threadId);
  if (!threadData) return import_SKIP_UPDATE.SKIP_UPDATE;
  return {
    id: threadData.threadId,
    threadId: threadData.threadId,
    // TODO remove in 0.8.0
    remoteId: threadData.remoteId,
    externalId: threadData.externalId,
    title: threadData.title,
    status: threadData.status,
    isMain: threadData.threadId === threadList.mainThreadId
  };
};
var ThreadListRuntimeImpl = class {
  constructor(_core, _runtimeFactory = import_ThreadRuntime.ThreadRuntimeImpl) {
    this._core = _core;
    this._runtimeFactory = _runtimeFactory;
    const stateBinding = new import_LazyMemoizeSubject.LazyMemoizeSubject({
      path: {},
      getState: () => getThreadListState(_core),
      subscribe: (callback) => _core.subscribe(callback)
    });
    this._getState = stateBinding.getState.bind(stateBinding);
    this._mainThreadListItemRuntime = new import_ThreadListItemRuntime.ThreadListItemRuntimeImpl(
      new import_ShallowMemoizeSubject.ShallowMemoizeSubject({
        path: {
          ref: `threadItems[main]`,
          threadSelector: { type: "main" }
        },
        getState: () => {
          return getThreadListItemState(this._core, this._core.mainThreadId);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
    this.main = new _runtimeFactory(
      new import_NestedSubscriptionSubject.NestedSubscriptionSubject({
        path: {
          ref: "threads.main",
          threadSelector: { type: "main" }
        },
        getState: () => _core.getMainThreadRuntimeCore(),
        subscribe: (callback) => _core.subscribe(callback)
      }),
      this._mainThreadListItemRuntime
      // TODO capture "main" threadListItem from context around useLocalRuntime / useExternalStoreRuntime
    );
  }
  _getState;
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this);
    this.switchToNewThread = this.switchToNewThread.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getById = this.getById.bind(this);
    this.getItemById = this.getItemById.bind(this);
    this.getItemByIndex = this.getItemByIndex.bind(this);
    this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
  }
  switchToThread(threadId) {
    return this._core.switchToThread(threadId);
  }
  switchToNewThread() {
    return this._core.switchToNewThread();
  }
  getState() {
    return this._getState();
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  _mainThreadListItemRuntime;
  main;
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(threadId) {
    return new this._runtimeFactory(
      new import_NestedSubscriptionSubject.NestedSubscriptionSubject({
        path: {
          ref: "threads[threadId=" + JSON.stringify(threadId) + "]",
          threadSelector: { type: "threadId", threadId }
        },
        getState: () => this._core.getThreadRuntimeCore(threadId),
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this.mainItem
      // TODO capture "main" threadListItem from context around useLocalRuntime / useExternalStoreRuntime
    );
  }
  getItemByIndex(idx) {
    return new import_ThreadListItemRuntime.ThreadListItemRuntimeImpl(
      new import_ShallowMemoizeSubject.ShallowMemoizeSubject({
        path: {
          ref: `threadItems[${idx}]`,
          threadSelector: { type: "index", index: idx }
        },
        getState: () => {
          return getThreadListItemState(this._core, this._core.threadIds[idx]);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
  getArchivedItemByIndex(idx) {
    return new import_ThreadListItemRuntime.ThreadListItemRuntimeImpl(
      new import_ShallowMemoizeSubject.ShallowMemoizeSubject({
        path: {
          ref: `archivedThreadItems[${idx}]`,
          threadSelector: { type: "archiveIndex", index: idx }
        },
        getState: () => {
          return getThreadListItemState(
            this._core,
            this._core.archivedThreadIds[idx]
          );
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
  getItemById(threadId) {
    return new import_ThreadListItemRuntime.ThreadListItemRuntimeImpl(
      new import_ShallowMemoizeSubject.ShallowMemoizeSubject({
        path: {
          ref: `threadItems[threadId=${threadId}]`,
          threadSelector: { type: "threadId", threadId }
        },
        getState: () => {
          return getThreadListItemState(this._core, threadId);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadListRuntimeImpl
});
//# sourceMappingURL=ThreadListRuntime.js.map