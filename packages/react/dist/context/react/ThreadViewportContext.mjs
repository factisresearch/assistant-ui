"use client";

// src/context/react/ThreadViewportContext.ts
import { createContext } from "react";
import { createContextHook } from "./utils/createContextHook.mjs";
import { createContextStoreHook } from "./utils/createContextStoreHook.mjs";
var ThreadViewportContext = createContext(null);
var useThreadViewportContext = createContextHook(
  ThreadViewportContext,
  "ThreadPrimitive.Viewport"
);
var { useThreadViewport, useThreadViewportStore } = createContextStoreHook(useThreadViewportContext, "useThreadViewport");
export {
  ThreadViewportContext,
  useThreadViewport,
  useThreadViewportStore
};
//# sourceMappingURL=ThreadViewportContext.mjs.map