"use client";

// src/primitives/composer/ComposerSend.tsx
import {
  createActionButton
} from "../../utils/createActionButton.mjs";
import { useCallback } from "react";
import { useCombinedStore } from "../../utils/combined/useCombinedStore.mjs";
import { useThreadRuntime } from "../../context/react/ThreadContext.mjs";
import { useComposerRuntime } from "../../context/index.mjs";
var useComposerSend = () => {
  const composerRuntime = useComposerRuntime();
  const threadRuntime = useThreadRuntime();
  const disabled = useCombinedStore(
    [threadRuntime, composerRuntime],
    (t, c) => t.isRunning || !c.isEditing || c.isEmpty
  );
  const callback = useCallback(() => {
    composerRuntime.send();
  }, [composerRuntime]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveSend = createActionButton(
  "ComposerPrimitive.Send",
  useComposerSend
);
export {
  ComposerPrimitiveSend,
  useComposerSend
};
//# sourceMappingURL=ComposerSend.mjs.map