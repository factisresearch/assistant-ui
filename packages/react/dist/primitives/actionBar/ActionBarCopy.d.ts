import { ActionButtonProps } from "../../utils/createActionButton";
declare const useActionBarPrimitiveCopy: ({ copiedDuration, }?: {
    copiedDuration?: number | undefined;
}) => (() => void) | null;
export declare namespace ActionBarPrimitiveCopy {
    type Element = HTMLButtonElement;
    type Props = ActionButtonProps<typeof useActionBarPrimitiveCopy>;
}
export declare const ActionBarPrimitiveCopy: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & {
    copiedDuration?: number | undefined;
} & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=ActionBarCopy.d.ts.map