"use client";

// src/primitives/attachment/AttachmentRemove.tsx
import {
  createActionButton
} from "../../utils/createActionButton.mjs";
import { useCallback } from "react";
import { useAttachmentRuntime } from "../../context/react/AttachmentContext.mjs";
var useAttachmentRemove = () => {
  const attachmentRuntime = useAttachmentRuntime();
  const handleRemoveAttachment = useCallback(() => {
    attachmentRuntime.remove();
  }, [attachmentRuntime]);
  return handleRemoveAttachment;
};
var AttachmentPrimitiveRemove = createActionButton(
  "AttachmentPrimitive.Remove",
  useAttachmentRemove
);
export {
  AttachmentPrimitiveRemove
};
//# sourceMappingURL=AttachmentRemove.mjs.map