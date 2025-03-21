import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, ComponentPropsWithoutRef, ElementType } from "react";
export declare namespace ContentPartPrimitiveText {
    type Element = ComponentRef<typeof Primitive.span>;
    type Props = Omit<ComponentPropsWithoutRef<typeof Primitive.span>, "children" | "asChild"> & {
        smooth?: boolean;
        component?: ElementType;
    };
}
export declare const ContentPartPrimitiveText: import("react").ForwardRefExoticComponent<Omit<Omit<import("react").ClassAttributes<HTMLSpanElement> & import("react").HTMLAttributes<HTMLSpanElement> & {
    asChild?: boolean;
}, "ref">, "children" | "asChild"> & {
    smooth?: boolean;
    component?: ElementType;
} & import("react").RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=ContentPartText.d.ts.map