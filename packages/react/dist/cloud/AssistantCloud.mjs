// src/cloud/AssistantCloud.tsx
import { AssistantCloudAPI } from "./AssistantCloudAPI.mjs";
import { AssistantCloudAuthTokens } from "./AssistantCloudAuthTokens.mjs";
import { AssistantCloudRuns } from "./AssistantCloudRuns.mjs";
import { AssistantCloudThreads } from "./AssistantCloudThreads.mjs";
var AssistantCloud = class {
  threads;
  auth;
  runs;
  constructor(config) {
    const api = new AssistantCloudAPI(config);
    this.threads = new AssistantCloudThreads(api);
    this.auth = {
      tokens: new AssistantCloudAuthTokens(api)
    };
    this.runs = new AssistantCloudRuns(api);
  }
};
export {
  AssistantCloud
};
//# sourceMappingURL=AssistantCloud.mjs.map