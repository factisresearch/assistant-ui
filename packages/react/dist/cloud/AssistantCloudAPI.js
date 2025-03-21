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

// src/cloud/AssistantCloudAPI.tsx
var AssistantCloudAPI_exports = {};
__export(AssistantCloudAPI_exports, {
  AssistantCloudAPI: () => AssistantCloudAPI
});
module.exports = __toCommonJS(AssistantCloudAPI_exports);
var import_AssistantCloudAuthStrategy = require("./AssistantCloudAuthStrategy.js");
var CloudAPIError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
};
var AssistantCloudAPI = class {
  _auth;
  _baseUrl;
  constructor(config) {
    if ("authToken" in config) {
      this._baseUrl = config.baseUrl;
      this._auth = new import_AssistantCloudAuthStrategy.AssistantCloudJWTAuthStrategy(config.authToken);
    } else if ("apiKey" in config) {
      this._baseUrl = "https://backend.assistant-api.com";
      this._auth = new import_AssistantCloudAuthStrategy.AssistantCloudAPIKeyAuthStrategy(
        config.apiKey,
        config.userId,
        config.workspaceId
      );
    } else if ("anonymous" in config) {
      this._baseUrl = config.baseUrl;
      this._auth = new import_AssistantCloudAuthStrategy.AssistantCloudAnonymousAuthStrategy(config.baseUrl);
    } else {
      throw new Error(
        "Invalid configuration: Must provide authToken, apiKey, or anonymous configuration"
      );
    }
  }
  async initializeAuth() {
    return !!this._auth.getAuthHeaders();
  }
  async makeRawRequest(endpoint, options = {}) {
    const authHeaders = await this._auth.getAuthHeaders();
    if (!authHeaders) throw new Error("Authorization failed");
    const headers = {
      ...authHeaders,
      ...options.headers,
      "Content-Type": "application/json"
    };
    const queryParams = new URLSearchParams();
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === false) continue;
        if (value === true) {
          queryParams.set(key, "true");
        } else {
          queryParams.set(key, value.toString());
        }
      }
    }
    const url = new URL(`${this._baseUrl}/v1${endpoint}`);
    url.search = queryParams.toString();
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : null
    });
    this._auth.readAuthHeaders(response.headers);
    if (!response.ok) {
      const text = await response.text();
      try {
        const body = JSON.parse(text);
        throw new CloudAPIError(body.message);
      } catch {
        throw new Error(
          `Request failed with status ${response.status}, ${text}`
        );
      }
    }
    return response;
  }
  async makeRequest(endpoint, options = {}) {
    const response = await this.makeRawRequest(endpoint, options);
    return response.json();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AssistantCloudAPI
});
//# sourceMappingURL=AssistantCloudAPI.js.map