import { CoreMessage } from "../types";
import { AssistantCloudAPI } from "./AssistantCloudAPI";
import { AssistantStream } from "assistant-stream";
type AssistantCloudRunsStreamBody = {
    thread_id: string;
    assistant_id: "system/thread_title";
    messages: CoreMessage[];
};
export declare class AssistantCloudRuns {
    private cloud;
    constructor(cloud: AssistantCloudAPI);
    stream(body: AssistantCloudRunsStreamBody): Promise<AssistantStream>;
}
export {};
//# sourceMappingURL=AssistantCloudRuns.d.ts.map