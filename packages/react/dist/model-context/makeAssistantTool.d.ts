import { FC } from "react";
import { type AssistantToolProps } from "./useAssistantTool";
export type AssistantTool = FC & {
    unstable_tool: AssistantToolProps<any, any>;
};
export declare const makeAssistantTool: <TArgs, TResult>(tool: AssistantToolProps<TArgs, TResult>) => AssistantTool;
//# sourceMappingURL=makeAssistantTool.d.ts.map