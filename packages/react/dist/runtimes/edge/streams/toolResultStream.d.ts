import { Tool } from "../../../model-context/ModelContextTypes";
import { LanguageModelV1StreamPart } from "@ai-sdk/provider";
import { ReadonlyJSONValue } from "../../../utils/json/json-value";
export type ToolResultStreamPart = LanguageModelV1StreamPart | {
    type: "annotations";
    annotations: ReadonlyJSONValue[];
} | {
    type: "data";
    data: ReadonlyJSONValue[];
} | {
    type: "source";
    source: {
        readonly sourceType: "url";
        readonly id: string;
        readonly url: string;
        readonly title?: string;
    };
} | {
    type: "tool-result";
    toolCallType: "function";
    toolCallId: string;
    toolName: string;
    result: unknown;
    isError?: boolean;
} | {
    type: "step-finish";
    finishReason: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown";
    usage: {
        promptTokens: number;
        completionTokens: number;
    };
    isContinued: boolean;
};
export declare function toolResultStream(tools: Record<string, Tool<any, any>> | undefined, abortSignal: AbortSignal): TransformStream<ToolResultStreamPart, ToolResultStreamPart>;
//# sourceMappingURL=toolResultStream.d.ts.map