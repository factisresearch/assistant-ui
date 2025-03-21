import { ActionButtonElement, ActionButtonProps } from "../../utils/createActionButton";
declare const useComposerCancel: () => (() => void) | null;
export declare namespace ComposerPrimitiveCancel {
    type Element = ActionButtonElement;
    type Props = ActionButtonProps<typeof useComposerCancel>;
}
export declare const ComposerPrimitiveCancel: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=ComposerCancel.d.ts.map