import { type ComponentType, type FC } from "react";
import type { Unstable_AudioContentPartComponent, EmptyContentPartComponent, TextContentPartComponent, ImageContentPartComponent, SourceContentPartComponent, ToolCallContentPartComponent, ToolCallContentPartProps, FileContentPartComponent, ReasoningContentPartComponent } from "../../types/ContentPartComponentTypes";
export declare namespace MessagePrimitiveContent {
    type Props = {
        components?: {
            Empty?: EmptyContentPartComponent | undefined;
            Text?: TextContentPartComponent | undefined;
            Reasoning?: ReasoningContentPartComponent | undefined;
            Source?: SourceContentPartComponent | undefined;
            Image?: ImageContentPartComponent | undefined;
            File?: FileContentPartComponent | undefined;
            Unstable_Audio?: Unstable_AudioContentPartComponent | undefined;
            tools?: {
                by_name?: Record<string, ToolCallContentPartComponent | undefined> | undefined;
                Fallback?: ComponentType<ToolCallContentPartProps> | undefined;
            } | {
                Override: ComponentType<ToolCallContentPartProps>;
            } | undefined;
        } | undefined;
    };
}
export declare const MessagePrimitiveContent: FC<MessagePrimitiveContent.Props>;
//# sourceMappingURL=MessageContent.d.ts.map