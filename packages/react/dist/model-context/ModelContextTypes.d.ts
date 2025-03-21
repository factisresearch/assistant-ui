import { z } from "zod";
import type { JSONSchema7 } from "json-schema";
import { Unsubscribe } from "../types/Unsubscribe";
export declare const LanguageModelV1CallSettingsSchema: z.ZodObject<{
    maxTokens: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    presencePenalty: z.ZodOptional<z.ZodNumber>;
    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    maxTokens?: number | undefined;
    temperature?: number | undefined;
    topP?: number | undefined;
    presencePenalty?: number | undefined;
    frequencyPenalty?: number | undefined;
    seed?: number | undefined;
    headers?: Record<string, string | undefined> | undefined;
}, {
    maxTokens?: number | undefined;
    temperature?: number | undefined;
    topP?: number | undefined;
    presencePenalty?: number | undefined;
    frequencyPenalty?: number | undefined;
    seed?: number | undefined;
    headers?: Record<string, string | undefined> | undefined;
}>;
export type LanguageModelV1CallSettings = z.infer<typeof LanguageModelV1CallSettingsSchema>;
export declare const LanguageModelConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    modelName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    baseUrl?: string | undefined;
    modelName?: string | undefined;
}, {
    apiKey?: string | undefined;
    baseUrl?: string | undefined;
    modelName?: string | undefined;
}>;
export type LanguageModelConfig = z.infer<typeof LanguageModelConfigSchema>;
export type ToolExecuteFunction<TArgs, TResult> = (args: TArgs, context: {
    toolCallId: string;
    abortSignal: AbortSignal;
}) => TResult | Promise<TResult>;
export type ToolStreamCallFunction<TArgs, TResult> = (iterator: AsyncGenerator<{
    args: TArgs;
    argsTextDelta: string;
}, void, unknown>, context: {
    toolCallId: string;
    abortSignal: AbortSignal;
}) => TResult | Promise<TResult>;
type OnSchemaValidationErrorFunction<TResult> = ToolExecuteFunction<unknown, TResult>;
export type Tool<TArgs = unknown, TResult = unknown> = {
    description?: string | undefined;
    parameters: z.ZodSchema<TArgs> | JSONSchema7;
    execute?: ToolExecuteFunction<TArgs, TResult>;
    /**
     * @deprecated TODO not yet implemented
     */
    experimental_streamCall?: ToolStreamCallFunction<TArgs, TResult>;
    experimental_onSchemaValidationError?: OnSchemaValidationErrorFunction<TResult>;
};
export type ModelContext = {
    priority?: number | undefined;
    system?: string | undefined;
    tools?: Record<string, Tool<any, any>> | undefined;
    callSettings?: LanguageModelV1CallSettings | undefined;
    config?: LanguageModelConfig | undefined;
};
export type ModelContextProvider = {
    getModelContext: () => ModelContext;
    subscribe?: (callback: () => void) => Unsubscribe;
};
export declare const mergeModelContexts: (configSet: Set<ModelContextProvider>) => ModelContext;
export {};
//# sourceMappingURL=ModelContextTypes.d.ts.map