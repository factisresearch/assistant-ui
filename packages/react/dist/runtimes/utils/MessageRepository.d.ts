import type { CoreMessage, ThreadMessage } from "../../types/AssistantTypes";
import { ThreadMessageLike } from "../external-store";
export type ExportedMessageRepositoryItem = {
    message: ThreadMessage;
    parentId: string | null;
};
export type ExportedMessageRepository = {
    headId?: string | null;
    messages: Array<{
        message: ThreadMessage;
        parentId: string | null;
    }>;
};
export declare const ExportedMessageRepository: {
    fromArray: (messages: readonly ThreadMessageLike[]) => ExportedMessageRepository;
};
export declare class MessageRepository {
    private messages;
    private head;
    private root;
    private performOp;
    private _messages;
    getMessages(): readonly ThreadMessage[];
    addOrUpdateMessage(parentId: string | null, message: ThreadMessage): void;
    getMessage(messageId: string): {
        parentId: string | null;
        message: ThreadMessage;
    };
    appendOptimisticMessage(parentId: string | null, message: CoreMessage): string;
    deleteMessage(messageId: string, replacementId?: string | null | undefined): void;
    getBranches(messageId: string): string[];
    switchToBranch(messageId: string): void;
    resetHead(messageId: string | null): void;
    clear(): void;
    export(): ExportedMessageRepository;
    import({ headId, messages }: ExportedMessageRepository): void;
}
//# sourceMappingURL=MessageRepository.d.ts.map