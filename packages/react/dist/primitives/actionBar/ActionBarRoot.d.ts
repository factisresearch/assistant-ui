import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, ComponentPropsWithoutRef } from "react";
type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export declare namespace ActionBarPrimitiveRoot {
    type Element = ComponentRef<typeof Primitive.div>;
    type Props = PrimitiveDivProps & {
        hideWhenRunning?: boolean | undefined;
        autohide?: "always" | "not-last" | "never" | undefined;
        autohideFloat?: "always" | "single-branch" | "never" | undefined;
    };
}
export declare const ActionBarPrimitiveRoot: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLDivElement> & import("react").HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & {
    hideWhenRunning?: boolean | undefined;
    autohide?: "always" | "not-last" | "never" | undefined;
    autohideFloat?: "always" | "single-branch" | "never" | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=ActionBarRoot.d.ts.map