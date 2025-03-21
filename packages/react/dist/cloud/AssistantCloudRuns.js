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

// src/cloud/AssistantCloudRuns.tsx
var AssistantCloudRuns_exports = {};
__export(AssistantCloudRuns_exports, {
  AssistantCloudRuns: () => AssistantCloudRuns
});
module.exports = __toCommonJS(AssistantCloudRuns_exports);
var import_assistant_stream = require("assistant-stream");
var AssistantCloudRuns = class {
  constructor(cloud) {
    this.cloud = cloud;
  }
  async stream(body) {
    const response = await this.cloud.makeRawRequest("/runs/stream", {
      method: "POST",
      headers: {
        Accept: "text/plain"
      },
      body
    });
    return import_assistant_stream.AssistantStream.fromResponse(response, new import_assistant_stream.PlainTextDecoder());
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssistantCloudRuns
});
//# sourceMappingURL=AssistantCloudRuns.js.map