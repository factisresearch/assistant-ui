import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, ComponentPropsWithoutRef } from "react";
export declare namespace BranchPickerPrimitiveRoot {
    type Element = ComponentRef<typeof Primitive.div>;
    type Props = ComponentPropsWithoutRef<typeof Primitive.div> & {
        hideWhenSingleBranch?: boolean | undefined;
    };
}
export declare const BranchPickerPrimitiveRoot: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & {
    hideWhenSingleBranch?: boolean | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=BranchPickerRoot.d.ts.map