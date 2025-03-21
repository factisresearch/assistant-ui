"use client";

// src/context/providers/ThreadListItemRuntimeProvider.tsx
import { useEffect, useState } from "react";
import { create } from "zustand";
import {
  ThreadListItemContext
} from "../react/ThreadListItemContext.mjs";
import { writableStore } from "../ReadonlyStore.mjs";
import { ensureBinding } from "../react/utils/ensureBinding.mjs";
import { jsx } from "react/jsx-runtime";
var useThreadListItemRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var ThreadListItemRuntimeProvider = ({ runtime, children }) => {
  const useThreadListItemRuntime = useThreadListItemRuntimeStore(runtime);
  const [context] = useState(() => {
    return { useThreadListItemRuntime };
  });
  return /* @__PURE__ */ jsx(ThreadListItemContext.Provider, { value: context, children });
};
export {
  ThreadListItemRuntimeProvider
};
//# sourceMappingURL=ThreadListItemRuntimeProvider.mjs.map