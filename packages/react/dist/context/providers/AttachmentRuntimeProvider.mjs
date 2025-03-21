"use client";

// src/context/providers/AttachmentRuntimeProvider.tsx
import { useEffect, useState } from "react";
import { create } from "zustand";
import { AttachmentContext } from "../react/AttachmentContext.mjs";
import { writableStore } from "../ReadonlyStore.mjs";
import { ensureBinding } from "../react/utils/ensureBinding.mjs";
import { jsx } from "react/jsx-runtime";
var useAttachmentRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var AttachmentRuntimeProvider = ({
  runtime,
  children
}) => {
  const useAttachmentRuntime = useAttachmentRuntimeStore(runtime);
  const [context] = useState(() => {
    return {
      useAttachmentRuntime
    };
  });
  return /* @__PURE__ */ jsx(AttachmentContext.Provider, { value: context, children });
};
export {
  AttachmentRuntimeProvider
};
//# sourceMappingURL=AttachmentRuntimeProvider.mjs.map