// src/runtimes/local/LocalRuntimeCore.tsx
import { BaseAssistantRuntimeCore } from "../core/BaseAssistantRuntimeCore.mjs";
import { LocalThreadRuntimeCore } from "./LocalThreadRuntimeCore.mjs";
import { LocalThreadListRuntimeCore } from "./LocalThreadListRuntimeCore.mjs";
import { ExportedMessageRepository } from "../utils/MessageRepository.mjs";
var LocalRuntimeCore = class extends BaseAssistantRuntimeCore {
  threads;
  Provider = void 0;
  _options;
  constructor(options, initialMessages) {
    super();
    this._options = options;
    this.threads = new LocalThreadListRuntimeCore(() => {
      return new LocalThreadRuntimeCore(this._contextProvider, this._options);
    });
    if (initialMessages) {
      this.threads.getMainThreadRuntimeCore().import(ExportedMessageRepository.fromArray(initialMessages));
    }
  }
};
export {
  LocalRuntimeCore
};
//# sourceMappingURL=LocalRuntimeCore.mjs.map