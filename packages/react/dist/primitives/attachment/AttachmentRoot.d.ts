import { Primitive } from "@radix-ui/react-primitive";
import { ComponentPropsWithoutRef, ComponentRef } from "react";
type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export declare namespace AttachmentPrimitiveRoot {
    type Element = ComponentRef<typeof Primitive.div>;
    type Props = PrimitiveDivProps;
}
export declare const AttachmentPrimitiveRoot: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=AttachmentRoot.d.ts.map