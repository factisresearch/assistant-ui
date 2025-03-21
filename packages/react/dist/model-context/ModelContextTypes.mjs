// src/model-context/ModelContextTypes.ts
import { z } from "zod";
var LanguageModelV1CallSettingsSchema = z.object({
  maxTokens: z.number().int().positive().optional(),
  temperature: z.number().optional(),
  topP: z.number().optional(),
  presencePenalty: z.number().optional(),
  frequencyPenalty: z.number().optional(),
  seed: z.number().int().optional(),
  headers: z.record(z.string().optional()).optional()
});
var LanguageModelConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  modelName: z.string().optional()
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
export {
  LanguageModelConfigSchema,
  LanguageModelV1CallSettingsSchema,
  mergeModelContexts
};
//# sourceMappingURL=ModelContextTypes.mjs.map