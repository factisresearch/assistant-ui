import { ActionButtonElement, ActionButtonProps } from "../../utils/createActionButton";
declare const useActionBarReload: () => (() => void) | null;
export declare namespace ActionBarPrimitiveReload {
    type Element = ActionButtonElement;
    type Props = ActionButtonProps<typeof useActionBarReload>;
}
export declare const ActionBarPrimitiveReload: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=ActionBarReload.d.ts.map