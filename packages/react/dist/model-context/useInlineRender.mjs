"use client";

// src/model-context/useInlineRender.tsx
import { useCallback, useEffect, useState } from "react";
import { create } from "zustand";
var useInlineRender = (toolUI) => {
  const [useToolUI] = useState(() => create(() => toolUI));
  useEffect(() => {
    useToolUI.setState(toolUI);
  }, [toolUI, useToolUI]);
  return useCallback(
    function ToolUI(args) {
      const toolUI2 = useToolUI();
      return toolUI2(args);
    },
    [useToolUI]
  );
};
export {
  useInlineRender
};
//# sourceMappingURL=useInlineRender.mjs.map