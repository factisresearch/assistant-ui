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

// src/api/ThreadRuntime.ts
var ThreadRuntime_exports = {};
__export(ThreadRuntime_exports, {
  ThreadRuntimeImpl: () => ThreadRuntimeImpl,
  getThreadState: () => getThreadState
});
module.exports = __toCommonJS(ThreadRuntime_exports);
var import_MessageRuntime = require("./MessageRuntime.js");
var import_NestedSubscriptionSubject = require("./subscribable/NestedSubscriptionSubject.js");
var import_ShallowMemoizeSubject = require("./subscribable/ShallowMemoizeSubject.js");
var import_ComposerRuntime = require("./ComposerRuntime.js");
var import_SKIP_UPDATE = require("./subscribable/SKIP_UPDATE.js");
var import_EventSubscriptionSubject = require("./subscribable/EventSubscriptionSubject.js");
var import_getExternalStoreMessage = require("../runtimes/external-store/getExternalStoreMessage.js");
var toStartRunConfig = (message) => {
  return {
    parentId: message.parentId ?? null,
    sourceId: message.sourceId ?? null,
    runConfig: message.runConfig ?? {}
  };
};
var toAppendMessage = (messages, message) => {
  if (typeof message === "string") {
    return {
      parentId: messages.at(-1)?.id ?? null,
      sourceId: null,
      runConfig: {},
      role: "user",
      content: [{ type: "text", text: message }],
      attachments: []
    };
  }
  if (message.role && message.parentId && message.attachments) {
    return message;
  }
  return {
    ...message,
    parentId: message.parentId ?? messages.at(-1)?.id ?? null,
    sourceId: message.sourceId ?? null,
    role: message.role ?? "user",
    attachments: message.attachments ?? []
  };
};
var getThreadState = (runtime, threadListItemState) => {
  const lastMessage = runtime.messages.at(-1);
  return Object.freeze({
    threadId: threadListItemState.id,
    metadata: threadListItemState,
    capabilities: runtime.capabilities,
    isDisabled: runtime.isDisabled,
    isRunning: lastMessage?.role !== "assistant" ? false : lastMessage.status.type === "running",
    messages: runtime.messages,
    suggestions: runtime.suggestions,
    extras: runtime.extras,
    speech: runtime.speech
  });
};
var ThreadRuntimeImpl = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  constructor(threadBinding, threadListItemBinding) {
    const stateBinding = new import_ShallowMemoizeSubject.ShallowMemoizeSubject({
      path: threadBinding.path,
      getState: () => getThreadState(
        threadBinding.getState(),
        threadListItemBinding.getState()
      ),
      subscribe: (callback) => {
        const sub1 = threadBinding.subscribe(callback);
        const sub2 = threadListItemBinding.subscribe(callback);
        return () => {
          sub1();
          sub2();
        };
      }
    });
    this._threadBinding = {
      path: threadBinding.path,
      getState: () => threadBinding.getState(),
      getStateState: () => stateBinding.getState(),
      outerSubscribe: (callback) => threadBinding.outerSubscribe(callback),
      subscribe: (callback) => threadBinding.subscribe(callback)
    };
    this.composer = new import_ComposerRuntime.ThreadComposerRuntimeImpl(
      new import_NestedSubscriptionSubject.NestedSubscriptionSubject({
        path: {
          ...this.path,
          ref: this.path.ref + `${this.path.ref}.composer`,
          composerSource: "thread"
        },
        getState: () => this._threadBinding.getState().composer,
        subscribe: (callback) => this._threadBinding.subscribe(callback)
      })
    );
  }
  __internal_bindMethods() {
    this.append = this.append.bind(this);
    this.startRun = this.startRun.bind(this);
    this.cancelRun = this.cancelRun.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    this.export = this.export.bind(this);
    this.import = this.import.bind(this);
    this.getMesssageByIndex = this.getMesssageByIndex.bind(this);
    this.getMesssageById = this.getMesssageById.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
    this.getModelContext = this.getModelContext.bind(this);
    this.getModelConfig = this.getModelConfig.bind(this);
    this.getState = this.getState.bind(this);
  }
  composer;
  getState() {
    return this._threadBinding.getStateState();
  }
  append(message) {
    this._threadBinding.getState().append(
      toAppendMessage(this._threadBinding.getState().messages, message)
    );
  }
  subscribe(callback) {
    return this._threadBinding.subscribe(callback);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  getModelConfig() {
    return this.getModelContext();
  }
  startRun(configOrParentId) {
    const config = configOrParentId === null || typeof configOrParentId === "string" ? { parentId: configOrParentId } : configOrParentId;
    return this._threadBinding.getState().startRun(toStartRunConfig(config));
  }
  cancelRun() {
    this._threadBinding.getState().cancelRun();
  }
  stopSpeaking() {
    return this._threadBinding.getState().stopSpeaking();
  }
  export() {
    return this._threadBinding.getState().export();
  }
  import(data) {
    this._threadBinding.getState().import(data);
  }
  getMesssageByIndex(idx) {
    if (idx < 0) throw new Error("Message index must be >= 0");
    return this._getMessageRuntime(
      {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.messages[${idx}]`,
        messageSelector: { type: "index", index: idx }
      },
      () => {
        const messages = this._threadBinding.getState().messages;
        const message = messages[idx];
        if (!message) return void 0;
        return {
          message,
          parentId: messages[idx - 1]?.id ?? null
        };
      }
    );
  }
  getMesssageById(messageId) {
    return this._getMessageRuntime(
      {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.messages[messageId=${JSON.stringify(messageId)}]`,
        messageSelector: { type: "messageId", messageId }
      },
      () => this._threadBinding.getState().getMessageById(messageId)
    );
  }
  _getMessageRuntime(path, callback) {
    return new import_MessageRuntime.MessageRuntimeImpl(
      new import_ShallowMemoizeSubject.ShallowMemoizeSubject({
        path,
        getState: () => {
          const { message, parentId } = callback() ?? {};
          const { messages, speech: speechState } = this._threadBinding.getState();
          if (!message || parentId === void 0) return import_SKIP_UPDATE.SKIP_UPDATE;
          const thread = this._threadBinding.getState();
          const branches = thread.getBranches(message.id);
          const submittedFeedback = thread.getSubmittedFeedback(message.id);
          return {
            ...message,
            ...{ [import_getExternalStoreMessage.symbolInnerMessage]: message[import_getExternalStoreMessage.symbolInnerMessage] },
            isLast: messages.at(-1)?.id === message.id,
            parentId,
            branchNumber: branches.indexOf(message.id) + 1,
            branchCount: branches.length,
            speech: speechState?.messageId === message.id ? speechState : void 0,
            submittedFeedback
          };
        },
        subscribe: (callback2) => this._threadBinding.subscribe(callback2)
      }),
      this._threadBinding
    );
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(event, callback) {
    let subject = this._eventSubscriptionSubjects.get(event);
    if (!subject) {
      subject = new import_EventSubscriptionSubject.EventSubscriptionSubject({
        event,
        binding: this._threadBinding
      });
      this._eventSubscriptionSubjects.set(event, subject);
    }
    return subject.subscribe(callback);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThreadRuntimeImpl,
  getThreadState
});
//# sourceMappingURL=ThreadRuntime.js.map