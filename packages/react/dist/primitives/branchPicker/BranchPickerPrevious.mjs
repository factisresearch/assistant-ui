"use client";

// src/primitives/branchPicker/BranchPickerPrevious.tsx
import {
  createActionButton
} from "../../utils/createActionButton.mjs";
import { useCallback } from "react";
import {
  useMessage,
  useMessageRuntime
} from "../../context/react/MessageContext.mjs";
var useBranchPickerPrevious = () => {
  const messageRuntime = useMessageRuntime();
  const disabled = useMessage((m) => m.branchNumber <= 1);
  const callback = useCallback(() => {
    messageRuntime.switchToBranch({ position: "previous" });
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var BranchPickerPrimitivePrevious = createActionButton(
  "BranchPickerPrimitive.Previous",
  useBranchPickerPrevious
);
export {
  BranchPickerPrimitivePrevious
};
//# sourceMappingURL=BranchPickerPrevious.mjs.map