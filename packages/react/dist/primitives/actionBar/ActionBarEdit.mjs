"use client";

// src/primitives/actionBar/ActionBarEdit.tsx
import {
  createActionButton
} from "../../utils/createActionButton.mjs";
import { useCallback } from "react";
import { useEditComposer, useMessageRuntime } from "../../context/index.mjs";
var useActionBarEdit = () => {
  const messageRuntime = useMessageRuntime();
  const disabled = useEditComposer((c) => c.isEditing);
  const callback = useCallback(() => {
    messageRuntime.composer.beginEdit();
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var ActionBarPrimitiveEdit = createActionButton(
  "ActionBarPrimitive.Edit",
  useActionBarEdit
);
export {
  ActionBarPrimitiveEdit
};
//# sourceMappingURL=ActionBarEdit.mjs.map