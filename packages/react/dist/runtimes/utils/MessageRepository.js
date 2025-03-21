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

// src/runtimes/utils/MessageRepository.tsx
var MessageRepository_exports = {};
__export(MessageRepository_exports, {
  ExportedMessageRepository: () => ExportedMessageRepository,
  MessageRepository: () => MessageRepository
});
module.exports = __toCommonJS(MessageRepository_exports);
var import_idUtils = require("../../utils/idUtils.js");
var import_fromCoreMessage = require("../edge/converters/fromCoreMessage.js");
var import_auto_status = require("../external-store/auto-status.js");
var import_ThreadMessageLike = require("../external-store/ThreadMessageLike.js");
var ExportedMessageRepository = {
  fromArray: (messages) => {
    const conv = messages.map(
      (m) => (0, import_ThreadMessageLike.fromThreadMessageLike)(m, (0, import_idUtils.generateId)(), (0, import_auto_status.getAutoStatus)(false, false))
    );
    return {
      messages: conv.map((m, idx) => ({
        parentId: idx > 0 ? conv[idx - 1].id : null,
        message: m
      }))
    };
  }
};
var findHead = (message) => {
  if (message.next) return findHead(message.next);
  if ("current" in message) return message;
  return null;
};
var CachedValue = class {
  constructor(func) {
    this.func = func;
  }
  _value = null;
  get value() {
    if (this._value === null) {
      this._value = this.func();
    }
    return this._value;
  }
  dirty() {
    this._value = null;
  }
};
var MessageRepository = class {
  messages = /* @__PURE__ */ new Map();
  // message_id -> item
  head = null;
  root = {
    children: [],
    next: null
  };
  performOp(newParent, child, operation) {
    const parentOrRoot = child.prev ?? this.root;
    const newParentOrRoot = newParent ?? this.root;
    if (operation === "relink" && parentOrRoot === newParentOrRoot) return;
    if (operation !== "link") {
      parentOrRoot.children = parentOrRoot.children.filter(
        (m) => m !== child.current.id
      );
      if (parentOrRoot.next === child) {
        const fallbackId = parentOrRoot.children.at(-1);
        const fallback = fallbackId ? this.messages.get(fallbackId) : null;
        if (fallback === void 0) {
          throw new Error(
            "MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui."
          );
        }
        parentOrRoot.next = fallback;
      }
    }
    if (operation !== "cut") {
      for (let current = newParent; current; current = current.prev) {
        if (current.current.id === child.current.id) {
          throw new Error(
            "MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui."
          );
        }
      }
      newParentOrRoot.children = [
        ...newParentOrRoot.children,
        child.current.id
      ];
      if (findHead(child) === this.head || newParentOrRoot.next === null) {
        newParentOrRoot.next = child;
      }
      child.prev = newParent;
    }
  }
  _messages = new CachedValue(() => {
    const messages = new Array(this.head?.level ?? 0);
    for (let current = this.head; current; current = current.prev) {
      messages[current.level] = current.current;
    }
    return messages;
  });
  getMessages() {
    return this._messages.value;
  }
  addOrUpdateMessage(parentId, message) {
    const existingItem = this.messages.get(message.id);
    const prev = parentId ? this.messages.get(parentId) : null;
    if (prev === void 0)
      throw new Error(
        "MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui."
      );
    if (existingItem) {
      existingItem.current = message;
      this.performOp(prev, existingItem, "relink");
      this._messages.dirty();
      return;
    }
    const newItem = {
      prev,
      current: message,
      next: null,
      children: [],
      level: prev ? prev.level + 1 : 0
    };
    this.messages.set(message.id, newItem);
    this.performOp(prev, newItem, "link");
    if (this.head === prev) {
      this.head = newItem;
    }
    this._messages.dirty();
  }
  getMessage(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui."
      );
    return {
      parentId: message.prev?.current.id ?? null,
      message: message.current
    };
  }
  appendOptimisticMessage(parentId, message) {
    let optimisticId;
    do {
      optimisticId = (0, import_idUtils.generateOptimisticId)();
    } while (this.messages.has(optimisticId));
    this.addOrUpdateMessage(
      parentId,
      (0, import_fromCoreMessage.fromCoreMessage)(message, {
        id: optimisticId,
        status: { type: "running" }
      })
    );
    return optimisticId;
  }
  deleteMessage(messageId, replacementId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(deleteMessage): Optimistic message not found. This is likely an internal bug in assistant-ui."
      );
    const replacement = replacementId === void 0 ? message.prev : replacementId === null ? null : this.messages.get(replacementId);
    if (replacement === void 0)
      throw new Error(
        "MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui."
      );
    for (const child of message.children) {
      const childMessage = this.messages.get(child);
      if (!childMessage)
        throw new Error(
          "MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui."
        );
      this.performOp(replacement, childMessage, "relink");
    }
    this.performOp(null, message, "cut");
    this.messages.delete(messageId);
    if (this.head === message) {
      this.head = findHead(replacement ?? this.root);
    }
    this._messages.dirty();
  }
  getBranches(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui."
      );
    const { children } = message.prev ?? this.root;
    return children;
  }
  switchToBranch(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui."
      );
    const prevOrRoot = message.prev ?? this.root;
    prevOrRoot.next = message;
    this.head = findHead(message);
    this._messages.dirty();
  }
  resetHead(messageId) {
    if (messageId === null) {
      this.head = null;
      this._messages.dirty();
      return;
    }
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui."
      );
    this.head = message;
    for (let current = message; current; current = current.prev) {
      if (current.prev) {
        current.prev.next = current;
      }
    }
    this._messages.dirty();
  }
  clear() {
    this.messages.clear();
    this.head = null;
    this.root = {
      children: [],
      next: null
    };
    this._messages.dirty();
  }
  export() {
    const exportItems = [];
    for (const [, message] of this.messages) {
      exportItems.push({
        message: message.current,
        parentId: message.prev?.current.id ?? null
      });
    }
    return {
      headId: this.head?.current.id ?? null,
      messages: exportItems
    };
  }
  import({ headId, messages }) {
    for (const { message, parentId } of messages) {
      this.addOrUpdateMessage(parentId, message);
    }
    this.resetHead(headId ?? messages.at(-1)?.message.id ?? null);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExportedMessageRepository,
  MessageRepository
});
//# sourceMappingURL=MessageRepository.js.map