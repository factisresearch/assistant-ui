import { ReadonlyStore } from "../ReadonlyStore";
import { UseBoundStore } from "zustand";
import { ThreadRuntime } from "../../api/ThreadRuntime";
import { ModelContext } from "../../model-context";
export type ThreadContextValue = {
    useThreadRuntime: UseBoundStore<ReadonlyStore<ThreadRuntime>>;
};
export declare const ThreadContext: import("react").Context<ThreadContextValue | null>;
export declare function useThreadRuntime(options?: {
    optional?: false | undefined;
}): ThreadRuntime;
export declare function useThreadRuntime(options?: {
    optional?: boolean | undefined;
}): ThreadRuntime | null;
export declare const useThread: {
    (): import("../..").ThreadState;
    <TSelected>(selector: (state: import("../..").ThreadState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").ThreadState) => TSelected) | undefined): import("../..").ThreadState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").ThreadState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").ThreadState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").ThreadState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").ThreadState) => TSelected) | undefined;
    }): import("../..").ThreadState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").ThreadState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").ThreadState) => TSelected) | undefined;
    }): import("../..").ThreadState | TSelected | null;
};
export declare const useThreadComposer: {
    (): import("../..").ThreadComposerState;
    <TSelected>(selector: (state: import("../..").ThreadComposerState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").ThreadComposerState) => TSelected) | undefined): import("../..").ThreadComposerState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").ThreadComposerState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").ThreadComposerState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").ThreadComposerState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").ThreadComposerState) => TSelected) | undefined;
    }): import("../..").ThreadComposerState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").ThreadComposerState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").ThreadComposerState) => TSelected) | undefined;
    }): import("../..").ThreadComposerState | TSelected | null;
};
export declare function useThreadModelContext(options?: {
    optional?: false | undefined;
}): ModelContext;
export declare function useThreadModelContext(options?: {
    optional?: boolean | undefined;
}): ModelContext | null;
//# sourceMappingURL=ThreadContext.d.ts.map