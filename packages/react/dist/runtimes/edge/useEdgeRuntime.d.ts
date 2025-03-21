import { LocalRuntimeOptions } from "..";
import { EdgeChatAdapterOptions } from "./EdgeChatAdapter";
export type EdgeRuntimeOptions = EdgeChatAdapterOptions & LocalRuntimeOptions;
export declare const useEdgeRuntime: (options: EdgeRuntimeOptions) => import("../../internal").AssistantRuntimeImpl;
//# sourceMappingURL=useEdgeRuntime.d.ts.map