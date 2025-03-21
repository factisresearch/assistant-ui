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

// src/api/subscribable/EventSubscriptionSubject.ts
var EventSubscriptionSubject_exports = {};
__export(EventSubscriptionSubject_exports, {
  EventSubscriptionSubject: () => EventSubscriptionSubject
});
module.exports = __toCommonJS(EventSubscriptionSubject_exports);
var import_BaseSubject = require("./BaseSubject.js");
var EventSubscriptionSubject = class extends import_BaseSubject.BaseSubject {
  constructor(config) {
    super();
    this.config = config;
  }
  getState() {
    return this.config.binding.getState();
  }
  outerSubscribe(callback) {
    return this.config.binding.subscribe(callback);
  }
  _connect() {
    const callback = () => {
      this.notifySubscribers();
    };
    let lastState = this.config.binding.getState();
    let innerUnsubscribe = lastState?.unstable_on(this.config.event, callback);
    const onRuntimeUpdate = () => {
      const newState = this.config.binding.getState();
      if (newState === lastState) return;
      lastState = newState;
      innerUnsubscribe?.();
      innerUnsubscribe = this.config.binding.getState()?.unstable_on(this.config.event, callback);
    };
    const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
    return () => {
      outerUnsubscribe?.();
      innerUnsubscribe?.();
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventSubscriptionSubject
});
//# sourceMappingURL=EventSubscriptionSubject.js.map