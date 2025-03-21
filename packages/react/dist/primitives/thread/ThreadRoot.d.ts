import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, ComponentPropsWithoutRef } from "react";
export declare namespace ThreadPrimitiveRoot {
    type Element = ComponentRef<typeof Primitive.div>;
    type Props = ComponentPropsWithoutRef<typeof Primitive.div>;
}
export declare const ThreadPrimitiveRoot: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ThreadRoot.d.ts.map