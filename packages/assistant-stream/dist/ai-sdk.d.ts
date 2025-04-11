import { TextStreamPart, Tool, ObjectStreamPart, LanguageModelV1StreamPart } from 'ai';
import { A as AssistantStream, a as AssistantStreamChunk, b as AssistantStreamController } from './assistant-stream-54RSz6y3.js';

declare const fromStreamText: (stream: ReadableStream<TextStreamPart<Record<string, Tool>>>) => AssistantStream;
declare const fromStreamObject: (stream: ReadableStream<ObjectStreamPart<unknown>>, toolName: string) => AssistantStream;

type AssistantTransformerFlushCallback = (controller: AssistantStreamController) => void | PromiseLike<void>;
type AssistantTransformerStartCallback = (controller: AssistantStreamController) => void | PromiseLike<void>;
type AssistantTransformerTransformCallback<I> = (chunk: I, controller: AssistantStreamController) => void | PromiseLike<void>;
type AssistantTransformer<I> = {
    flush?: AssistantTransformerFlushCallback;
    start?: AssistantTransformerStartCallback;
    transform?: AssistantTransformerTransformCallback<I>;
};
declare class AssistantTransformStream<I> extends TransformStream<I, AssistantStreamChunk> {
    constructor(transformer: AssistantTransformer<I>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<AssistantStreamChunk>);
}

declare class LanguageModelV1StreamDecoder extends AssistantTransformStream<LanguageModelV1StreamPart> {
    constructor();
}

export { LanguageModelV1StreamDecoder, fromStreamObject, fromStreamText };
