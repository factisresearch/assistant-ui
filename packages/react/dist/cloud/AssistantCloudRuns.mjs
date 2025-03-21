// src/cloud/AssistantCloudRuns.tsx
import { AssistantStream, PlainTextDecoder } from "assistant-stream";
var AssistantCloudRuns = class {
  constructor(cloud) {
    this.cloud = cloud;
  }
  async stream(body) {
    const response = await this.cloud.makeRawRequest("/runs/stream", {
      method: "POST",
      headers: {
        Accept: "text/plain"
      },
      body
    });
    return AssistantStream.fromResponse(response, new PlainTextDecoder());
  }
};
export {
  AssistantCloudRuns
};
//# sourceMappingURL=AssistantCloudRuns.mjs.map