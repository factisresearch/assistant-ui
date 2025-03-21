// src/runtimes/core/BaseAssistantRuntimeCore.tsx
import { CompositeContextProvider } from "../../utils/CompositeContextProvider.mjs";
var BaseAssistantRuntimeCore = class {
  _contextProvider = new CompositeContextProvider();
  registerModelContextProvider(provider) {
    return this._contextProvider.registerModelContextProvider(provider);
  }
};
export {
  BaseAssistantRuntimeCore
};
//# sourceMappingURL=BaseAssistantRuntimeCore.mjs.map