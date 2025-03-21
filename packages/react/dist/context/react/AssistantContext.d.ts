import type { AssistantToolUIsState } from "../stores/AssistantToolUIs";
import { ReadonlyStore } from "../ReadonlyStore";
import { UseBoundStore } from "zustand";
import { AssistantRuntime } from "../../api/AssistantRuntime";
export type AssistantContextValue = {
    useAssistantRuntime: UseBoundStore<ReadonlyStore<AssistantRuntime>>;
    useToolUIs: UseBoundStore<ReadonlyStore<AssistantToolUIsState>>;
};
export declare const AssistantContext: import("react").Context<AssistantContextValue | null>;
export declare const useAssistantContext: (options?: {
    optional?: boolean | undefined;
} | undefined) => AssistantContextValue | null;
export declare function useAssistantRuntime(options?: {
    optional?: false | undefined;
}): AssistantRuntime;
export declare function useAssistantRuntime(options?: {
    optional?: boolean | undefined;
}): AssistantRuntime | null;
export declare const useToolUIs: {
    (): AssistantToolUIsState;
    <TSelected>(selector: (state: AssistantToolUIsState) => TSelected): TSelected;
    (options: {
        optional: true;
    }): AssistantToolUIsState | null;
    <TSelected>(options: {
        optional: true;
        selector?: (state: AssistantToolUIsState) => TSelected;
    }): TSelected | null;
}, useToolUIsStore: {
    (): ReadonlyStore<AssistantToolUIsState>;
    (options: {
        optional: true;
    }): ReadonlyStore<AssistantToolUIsState> | null;
};
export declare const useThreadList: {
    (): import("../..").ThreadListState;
    <TSelected>(selector: (state: import("../..").ThreadListState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").ThreadListState) => TSelected) | undefined): import("../..").ThreadListState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").ThreadListState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").ThreadListState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").ThreadListState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").ThreadListState) => TSelected) | undefined;
    }): import("../..").ThreadListState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").ThreadListState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").ThreadListState) => TSelected) | undefined;
    }): import("../..").ThreadListState | TSelected | null;
};
//# sourceMappingURL=AssistantContext.d.ts.map