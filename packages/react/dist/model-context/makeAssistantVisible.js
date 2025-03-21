"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/model-context/makeAssistantVisible.tsx
var makeAssistantVisible_exports = {};
__export(makeAssistantVisible_exports, {
  default: () => makeAssistantVisible_default,
  makeAssistantVisible: () => makeAssistantVisible
});
module.exports = __toCommonJS(makeAssistantVisible_exports);
var import_react = require("react");
var import_zod = require("zod");
var import_context = require("../context/index.js");
var import_react_compose_refs = require("@radix-ui/react-compose-refs");
var import_tool = require("./tool.js");
var import_jsx_runtime = require("react/jsx-runtime");
var click = (0, import_tool.tool)({
  parameters: import_zod.z.object({
    clickId: import_zod.z.string()
  }),
  execute: async ({ clickId }) => {
    const escapedClickId = CSS.escape(clickId);
    const el = document.querySelector(`[data-click-id='${escapedClickId}']`);
    if (el instanceof HTMLElement) {
      el.click();
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      return {};
    } else {
      return "Element not found";
    }
  }
});
var edit = (0, import_tool.tool)({
  parameters: import_zod.z.object({
    editId: import_zod.z.string(),
    value: import_zod.z.string()
  }),
  execute: async ({ editId, value }) => {
    const escapedEditId = CSS.escape(editId);
    const el = document.querySelector(`[data-edit-id='${escapedEditId}']`);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      return {};
    } else {
      return "Element not found";
    }
  }
});
var ReadableContext = (0, import_react.createContext)(false);
var makeAssistantVisible = (Component, config) => {
  const ReadableComponent = (0, import_react.forwardRef)(
    (props, outerRef) => {
      const isNestedReadable = (0, import_react.useContext)(ReadableContext);
      const clickId = (0, import_react.useId)();
      const componentRef = (0, import_react.useRef)(null);
      const assistant = (0, import_context.useAssistantRuntime)();
      (0, import_react.useEffect)(() => {
        return assistant.registerModelContextProvider({
          getModelContext: () => {
            return {
              tools: {
                ...config?.clickable ? { click } : {},
                ...config?.editable ? { edit } : {}
              },
              system: !isNestedReadable ? componentRef.current?.outerHTML : void 0
            };
          }
        });
      }, [config?.clickable, config?.editable, isNestedReadable, assistant]);
      const ref = (0, import_react_compose_refs.useComposedRefs)(componentRef, outerRef);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadableContext.Provider, { value: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Component,
        {
          ...props,
          ...config?.clickable ? { "data-click-id": clickId } : {},
          ...config?.editable ? { "data-edit-id": clickId } : {},
          ref
        }
      ) });
    }
  );
  ReadableComponent.displayName = Component.displayName;
  return ReadableComponent;
};
var makeAssistantVisible_default = makeAssistantVisible;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeAssistantVisible
});
//# sourceMappingURL=makeAssistantVisible.js.map