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

// src/utils/CompositeContextProvider.ts
var CompositeContextProvider_exports = {};
__export(CompositeContextProvider_exports, {
  CompositeContextProvider: () => CompositeContextProvider
});
module.exports = __toCommonJS(CompositeContextProvider_exports);
var import_ModelContextTypes = require("../model-context/ModelContextTypes.js");
var CompositeContextProvider = class {
  _providers = /* @__PURE__ */ new Set();
  getModelContext() {
    return (0, import_ModelContextTypes.mergeModelContexts)(this._providers);
  }
  registerModelContextProvider(provider) {
    this._providers.add(provider);
    const unsubscribe = provider.subscribe?.(() => {
      this.notifySubscribers();
    });
    this.notifySubscribers();
    return () => {
      this._providers.delete(provider);
      unsubscribe?.();
      this.notifySubscribers();
    };
  }
  _subscribers = /* @__PURE__ */ new Set();
  notifySubscribers() {
    for (const callback of this._subscribers) callback();
  }
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompositeContextProvider
});
//# sourceMappingURL=CompositeContextProvider.js.map