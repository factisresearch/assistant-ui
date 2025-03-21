import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
import type { Tool } from "./ModelContextTypes";
export type AssistantToolProps<TArgs, TResult> = Tool<TArgs, TResult> & {
    toolName: string;
    render?: ToolCallContentPartComponent<TArgs, TResult> | undefined;
    disabled?: boolean | undefined;
};
export declare const useAssistantTool: <TArgs, TResult>(tool: AssistantToolProps<TArgs, TResult>) => void;
//# sourceMappingURL=useAssistantTool.d.ts.map