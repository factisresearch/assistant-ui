import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, ComponentPropsWithoutRef } from "react";
export declare namespace ThreadPrimitiveViewport {
    type Element = ComponentRef<typeof Primitive.div>;
    type Props = ComponentPropsWithoutRef<typeof Primitive.div> & {
        autoScroll?: boolean | undefined;
    };
}
export declare const ThreadPrimitiveViewport: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & {
    autoScroll?: boolean | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ThreadViewport.d.ts.map