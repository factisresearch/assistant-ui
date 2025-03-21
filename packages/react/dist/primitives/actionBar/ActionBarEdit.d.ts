import { ActionButtonElement, ActionButtonProps } from "../../utils/createActionButton";
declare const useActionBarEdit: () => (() => void) | null;
export declare namespace ActionBarPrimitiveEdit {
    type Element = ActionButtonElement;
    type Props = ActionButtonProps<typeof useActionBarEdit>;
}
export declare const ActionBarPrimitiveEdit: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=ActionBarEdit.d.ts.map