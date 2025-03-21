import { LanguageModelV1Message } from "@ai-sdk/provider";
import { CoreMessage, ThreadMessage } from "../../../types/AssistantTypes";
export declare function toLanguageModelMessages(message: readonly CoreMessage[] | readonly ThreadMessage[], options?: {
    unstable_includeId?: boolean | undefined;
}): LanguageModelV1Message[];
//# sourceMappingURL=toLanguageModelMessages.d.ts.map