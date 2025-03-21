import { ReadonlyStore } from "../ReadonlyStore";
import { MessageUtilsState } from "../stores/MessageUtils";
import { UseBoundStore } from "zustand";
import { MessageRuntime } from "../../api/MessageRuntime";
export type MessageContextValue = {
    useMessageRuntime: UseBoundStore<ReadonlyStore<MessageRuntime>>;
    useMessageUtils: UseBoundStore<ReadonlyStore<MessageUtilsState>>;
};
export declare const MessageContext: import("react").Context<MessageContextValue | null>;
export declare function useMessageRuntime(options?: {
    optional?: false | undefined;
}): MessageRuntime;
export declare function useMessageRuntime(options?: {
    optional?: boolean | undefined;
}): MessageRuntime | null;
export declare const useMessage: {
    (): import("../..").MessageState;
    <TSelected>(selector: (state: import("../..").MessageState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").MessageState) => TSelected) | undefined): import("../..").MessageState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").MessageState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").MessageState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").MessageState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").MessageState) => TSelected) | undefined;
    }): import("../..").MessageState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").MessageState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").MessageState) => TSelected) | undefined;
    }): import("../..").MessageState | TSelected | null;
};
export declare const useEditComposer: {
    (): import("../..").EditComposerState;
    <TSelected>(selector: (state: import("../..").EditComposerState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").EditComposerState) => TSelected) | undefined): import("../..").EditComposerState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").EditComposerState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").EditComposerState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").EditComposerState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").EditComposerState) => TSelected) | undefined;
    }): import("../..").EditComposerState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").EditComposerState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").EditComposerState) => TSelected) | undefined;
    }): import("../..").EditComposerState | TSelected | null;
};
export declare const useMessageUtils: {
    (): MessageUtilsState;
    <TSelected>(selector: (state: MessageUtilsState) => TSelected): TSelected;
    (options: {
        optional: true;
    }): MessageUtilsState | null;
    <TSelected>(options: {
        optional: true;
        selector?: (state: MessageUtilsState) => TSelected;
    }): TSelected | null;
}, useMessageUtilsStore: {
    (): ReadonlyStore<MessageUtilsState>;
    (options: {
        optional: true;
    }): ReadonlyStore<MessageUtilsState> | null;
};
//# sourceMappingURL=MessageContext.d.ts.map