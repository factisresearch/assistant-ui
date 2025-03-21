"use client";

// src/model-context/makeAssistantToolUI.tsx
import {
  useAssistantToolUI
} from "./useAssistantToolUI.mjs";
var makeAssistantToolUI = (tool) => {
  const ToolUI = () => {
    useAssistantToolUI(tool);
    return null;
  };
  ToolUI.unstable_tool = tool;
  return ToolUI;
};
export {
  makeAssistantToolUI
};
//# sourceMappingURL=makeAssistantToolUI.mjs.map