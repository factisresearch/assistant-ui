"use client";

// src/primitives/actionBar/ActionBarReload.tsx
import {
  createActionButton
} from "../../utils/createActionButton.mjs";
import { useCallback } from "react";
import { useMessageRuntime } from "../../context/index.mjs";
import { useThreadRuntime } from "../../context/react/ThreadContext.mjs";
import { useCombinedStore } from "../../utils/combined/useCombinedStore.mjs";
var useActionBarReload = () => {
  const messageRuntime = useMessageRuntime();
  const threadRuntime = useThreadRuntime();
  const disabled = useCombinedStore(
    [threadRuntime, messageRuntime],
    (t, m) => t.isRunning || t.isDisabled || m.role !== "assistant"
  );
  const callback = useCallback(() => {
    messageRuntime.reload();
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var ActionBarPrimitiveReload = createActionButton(
  "ActionBarPrimitive.Reload",
  useActionBarReload
);
export {
  ActionBarPrimitiveReload
};
//# sourceMappingURL=ActionBarReload.mjs.map