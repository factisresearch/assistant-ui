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

// src/model-context/ModelContextTypes.ts
var ModelContextTypes_exports = {};
__export(ModelContextTypes_exports, {
  LanguageModelConfigSchema: () => LanguageModelConfigSchema,
  LanguageModelV1CallSettingsSchema: () => LanguageModelV1CallSettingsSchema,
  mergeModelContexts: () => mergeModelContexts
});
module.exports = __toCommonJS(ModelContextTypes_exports);
var import_zod = require("zod");
var LanguageModelV1CallSettingsSchema = import_zod.z.object({
  maxTokens: import_zod.z.number().int().positive().optional(),
  temperature: import_zod.z.number().optional(),
  topP: import_zod.z.number().optional(),
  presencePenalty: import_zod.z.number().optional(),
  frequencyPenalty: import_zod.z.number().optional(),
  seed: import_zod.z.number().int().optional(),
  headers: import_zod.z.record(import_zod.z.string().optional()).optional()
});
var LanguageModelConfigSchema = import_zod.z.object({
  apiKey: import_zod.z.string().optional(),
  baseUrl: import_zod.z.string().optional(),
  modelName: import_zod.z.string().optional()
});
var mergeModelContexts = (configSet) => {
  const configs = Array.from(configSet).map((c) => c.getModelContext()).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return configs.reduce((acc, config) => {
    if (config.system) {
      if (acc.system) {
        acc.system += `

${config.system}`;
      } else {
        acc.system = config.system;
      }
    }
    if (config.tools) {
      for (const [name, tool] of Object.entries(config.tools)) {
        const existing = acc.tools?.[name];
        if (existing && existing !== tool) {
          throw new Error(
            `You tried to define a tool with the name ${name}, but it already exists.`
          );
        }
        if (!acc.tools) acc.tools = {};
        acc.tools[name] = tool;
      }
    }
    if (config.config) {
      acc.config = {
        ...acc.config,
        ...config.config
      };
    }
    if (config.callSettings) {
      acc.callSettings = {
        ...acc.callSettings,
        ...config.callSettings
      };
    }
    return acc;
  }, {});
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LanguageModelConfigSchema,
  LanguageModelV1CallSettingsSchema,
  mergeModelContexts
});
//# sourceMappingURL=ModelContextTypes.js.map