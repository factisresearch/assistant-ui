import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, ComponentPropsWithoutRef } from "react";
export declare namespace ComposerPrimitiveRoot {
    type Element = ComponentRef<typeof Primitive.form>;
    type Props = ComponentPropsWithoutRef<typeof Primitive.form>;
}
export declare const ComposerPrimitiveRoot: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLFormElement> & import("react").FormHTMLAttributes<HTMLFormElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLFormElement>>;
//# sourceMappingURL=ComposerRoot.d.ts.map