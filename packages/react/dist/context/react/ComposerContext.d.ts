import { ComposerRuntime } from "../../api/ComposerRuntime";
export declare function useComposerRuntime(options?: {
    optional?: false | undefined;
}): ComposerRuntime;
export declare function useComposerRuntime(options?: {
    optional?: boolean | undefined;
}): ComposerRuntime | null;
export declare const useComposer: {
    (): import("../..").ComposerState;
    <TSelected>(selector: (state: import("../..").ComposerState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").ComposerState) => TSelected) | undefined): import("../..").ComposerState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").ComposerState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").ComposerState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").ComposerState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").ComposerState) => TSelected) | undefined;
    }): import("../..").ComposerState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").ComposerState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").ComposerState) => TSelected) | undefined;
    }): import("../..").ComposerState | TSelected | null;
};
//# sourceMappingURL=ComposerContext.d.ts.map