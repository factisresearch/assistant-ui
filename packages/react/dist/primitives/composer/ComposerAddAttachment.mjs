"use client";

// src/primitives/composer/ComposerAddAttachment.tsx
import {
  createActionButton
} from "../../utils/createActionButton.mjs";
import { useCallback } from "react";
import { useComposer, useComposerRuntime } from "../../context/index.mjs";
var useComposerAddAttachment = ({
  multiple = true
} = {}) => {
  const disabled = useComposer((c) => !c.isEditing);
  const composerRuntime = useComposerRuntime();
  const callback = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    const attachmentAccept = composerRuntime.getAttachmentAccept();
    if (attachmentAccept !== "*") {
      input.accept = attachmentAccept;
    }
    input.onchange = (e) => {
      const fileList = e.target.files;
      if (!fileList) return;
      for (const file of fileList) {
        composerRuntime.addAttachment(file);
      }
    };
    input.click();
  }, [composerRuntime, multiple]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveAddAttachment = createActionButton(
  "ComposerPrimitive.AddAttachment",
  useComposerAddAttachment,
  ["multiple"]
);
export {
  ComposerPrimitiveAddAttachment
};
//# sourceMappingURL=ComposerAddAttachment.mjs.map