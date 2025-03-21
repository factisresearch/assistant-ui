import { ActionButtonElement, ActionButtonProps } from "../../utils/createActionButton";
declare const useBranchPickerNext: () => (() => void) | null;
export declare namespace BranchPickerPrimitiveNext {
    type Element = ActionButtonElement;
    type Props = ActionButtonProps<typeof useBranchPickerNext>;
}
export declare const BranchPickerPrimitiveNext: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=BranchPickerNext.d.ts.map