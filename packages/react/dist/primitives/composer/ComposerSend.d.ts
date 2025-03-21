import { ActionButtonElement, ActionButtonProps } from "../../utils/createActionButton";
export declare const useComposerSend: () => (() => void) | null;
export declare namespace ComposerPrimitiveSend {
    type Element = ActionButtonElement;
    type Props = ActionButtonProps<typeof useComposerSend>;
}
export declare const ComposerPrimitiveSend: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=ComposerSend.d.ts.map