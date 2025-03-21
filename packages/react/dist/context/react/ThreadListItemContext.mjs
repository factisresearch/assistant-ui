"use client";

// src/context/react/ThreadListItemContext.ts
import { createContext } from "react";
import { createContextHook } from "./utils/createContextHook.mjs";
import { createStateHookForRuntime } from "./utils/createStateHookForRuntime.mjs";
var ThreadListItemContext = createContext(null);
var useThreadListItemContext = createContextHook(
  ThreadListItemContext,
  "a component passed to <ThreadListPrimitive.Items components={...}>"
);
function useThreadListItemRuntime(options) {
  const context = useThreadListItemContext(options);
  if (!context) return null;
  return context.useThreadListItemRuntime();
}
var useThreadListItem = createStateHookForRuntime(
  useThreadListItemRuntime
);
export {
  ThreadListItemContext,
  useThreadListItem,
  useThreadListItemRuntime
};
//# sourceMappingURL=ThreadListItemContext.mjs.map