"use client";

// src/context/providers/ThreadRuntimeProvider.tsx
import { useEffect, useState } from "react";
import { ThreadContext } from "../react/ThreadContext.mjs";
import { writableStore } from "../ReadonlyStore.mjs";
import { create } from "zustand";
import { ThreadListItemRuntimeProvider } from "./ThreadListItemRuntimeProvider.mjs";
import { ensureBinding } from "../react/utils/ensureBinding.mjs";
import { ThreadViewportProvider } from "./ThreadViewportProvider.mjs";
import { jsx } from "react/jsx-runtime";
var useThreadRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    ensureBinding(runtime.composer);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var ThreadRuntimeProvider = ({ children, listItemRuntime: threadListItemRuntime, runtime }) => {
  const useThreadRuntime = useThreadRuntimeStore(runtime);
  const [context] = useState(() => {
    return {
      useThreadRuntime
    };
  });
  return /* @__PURE__ */ jsx(ThreadListItemRuntimeProvider, { runtime: threadListItemRuntime, children: /* @__PURE__ */ jsx(ThreadContext.Provider, { value: context, children: /* @__PURE__ */ jsx(ThreadViewportProvider, { children }) }) });
};
export {
  ThreadRuntimeProvider
};
//# sourceMappingURL=ThreadRuntimeProvider.mjs.map