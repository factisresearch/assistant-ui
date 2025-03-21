"use client";

// src/cloud/useCloudThreadListRuntime.tsx
import { useRemoteThreadListRuntime } from "../runtimes/remote-thread-list/useRemoteThreadListRuntime.mjs";
import { useCloudThreadListAdapter } from "../runtimes/remote-thread-list/adapter/cloud.mjs";
var useCloudThreadListRuntime = ({
  runtimeHook,
  ...adapterOptions
}) => {
  const adapter = useCloudThreadListAdapter(adapterOptions);
  const runtime = useRemoteThreadListRuntime({
    runtimeHook,
    adapter
  });
  return runtime;
};
export {
  useCloudThreadListRuntime
};
//# sourceMappingURL=useCloudThreadListRuntime.mjs.map