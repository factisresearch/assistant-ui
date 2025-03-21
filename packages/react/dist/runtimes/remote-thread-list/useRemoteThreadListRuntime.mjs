"use client";

// src/runtimes/remote-thread-list/useRemoteThreadListRuntime.tsx
import { useState, useEffect, useMemo } from "react";
import { BaseAssistantRuntimeCore } from "../core/BaseAssistantRuntimeCore.mjs";
import { RemoteThreadListThreadListRuntimeCore } from "./RemoteThreadListThreadListRuntimeCore.mjs";
import { AssistantRuntimeImpl } from "../../internal.mjs";
var RemoteThreadListRuntimeCore = class extends BaseAssistantRuntimeCore {
  threads;
  constructor(options) {
    super();
    this.threads = new RemoteThreadListThreadListRuntimeCore(
      options,
      this._contextProvider
    );
  }
  get RenderComponent() {
    return this.threads.__internal_RenderComponent;
  }
};
var useRemoteThreadListRuntime = (options) => {
  const [runtime] = useState(() => new RemoteThreadListRuntimeCore(options));
  useEffect(() => {
    runtime.threads.__internal_setOptions(options);
    runtime.threads.__internal_load();
  }, [runtime, options]);
  return useMemo(() => new AssistantRuntimeImpl(runtime), [runtime]);
};
export {
  useRemoteThreadListRuntime
};
//# sourceMappingURL=useRemoteThreadListRuntime.mjs.map