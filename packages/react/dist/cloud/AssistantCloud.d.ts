import { AssistantCloudConfig } from "./AssistantCloudAPI";
import { AssistantCloudAuthTokens } from "./AssistantCloudAuthTokens";
import { AssistantCloudRuns } from "./AssistantCloudRuns";
import { AssistantCloudThreads } from "./AssistantCloudThreads";
export declare class AssistantCloud {
    readonly threads: AssistantCloudThreads;
    readonly auth: {
        tokens: AssistantCloudAuthTokens;
    };
    readonly runs: AssistantCloudRuns;
    constructor(config: AssistantCloudConfig);
}
//# sourceMappingURL=AssistantCloud.d.ts.map