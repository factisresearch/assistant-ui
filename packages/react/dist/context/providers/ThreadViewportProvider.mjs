"use client";

// src/context/providers/ThreadViewportProvider.tsx
import { useEffect, useState } from "react";
import { makeThreadViewportStore } from "../stores/ThreadViewport.mjs";
import {
  ThreadViewportContext,
  useThreadViewportStore
} from "../react/ThreadViewportContext.mjs";
import { writableStore } from "../ReadonlyStore.mjs";
import { jsx } from "react/jsx-runtime";
var useThreadViewportStoreValue = () => {
  const outerViewport = useThreadViewportStore({ optional: true });
  const [store] = useState(() => makeThreadViewportStore());
  useEffect(() => {
    return outerViewport?.getState().onScrollToBottom(() => {
      store.getState().scrollToBottom();
    });
  }, [outerViewport, store]);
  useEffect(() => {
    if (!outerViewport) return;
    return store.subscribe((state) => {
      if (outerViewport.getState().isAtBottom !== state.isAtBottom) {
        writableStore(outerViewport).setState({ isAtBottom: state.isAtBottom });
      }
    });
  }, [store, outerViewport]);
  return store;
};
var ThreadViewportProvider = ({ children }) => {
  const useThreadViewport = useThreadViewportStoreValue();
  const [context] = useState(() => {
    return {
      useThreadViewport
    };
  });
  return /* @__PURE__ */ jsx(ThreadViewportContext.Provider, { value: context, children });
};
export {
  ThreadViewportProvider
};
//# sourceMappingURL=ThreadViewportProvider.mjs.map