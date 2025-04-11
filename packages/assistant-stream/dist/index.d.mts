import { a as AssistantStreamChunk, T as ToolResponse, R as ReadonlyJSONValue, c as AssistantMessage, d as AssistantStreamEncoder, A as AssistantStream } from './assistant-stream-54RSz6y3.mjs';
export { e as createAssistantStream, f as createAssistantStreamResponse } from './assistant-stream-54RSz6y3.mjs';

declare class PipeableTransformStream<I, O> extends TransformStream<I, O> {
    constructor(transform: (readable: ReadableStream<I>) => ReadableStream<O>);
}

type ToolCallback = (toolCall: {
    toolCallId: string;
    toolName: string;
    args: unknown;
}) => Promise<ToolResponse<ReadonlyJSONValue>> | ToolResponse<ReadonlyJSONValue> | undefined;
declare class ToolExecutionStream extends PipeableTransformStream<AssistantStreamChunk, AssistantStreamChunk> {
    constructor(toolCallback: ToolCallback);
}

declare class AssistantMessageAccumulator extends TransformStream<AssistantStreamChunk, AssistantMessage> {
    constructor({ initialMessage, }?: {
        initialMessage?: AssistantMessage;
    });
}

declare class DataStreamEncoder extends PipeableTransformStream<AssistantStreamChunk, Uint8Array> implements AssistantStreamEncoder {
    headers: Headers;
    constructor();
}
declare class DataStreamDecoder extends PipeableTransformStream<Uint8Array, AssistantStreamChunk> {
    constructor();
}

declare class PlainTextEncoder extends PipeableTransformStream<AssistantStreamChunk, Uint8Array> implements AssistantStreamEncoder {
    headers: Headers;
    constructor();
}
declare class PlainTextDecoder extends PipeableTransformStream<Uint8Array, AssistantStreamChunk> {
    constructor();
}

declare class AssistantMessageStream {
    readonly readable: ReadableStream<AssistantMessage>;
    constructor(readable: ReadableStream<AssistantMessage>);
    static fromAssistantStream(stream: AssistantStream): AssistantMessageStream;
    unstable_result(): Promise<AssistantMessage>;
    [Symbol.asyncIterator](): {
        next(): Promise<IteratorResult<AssistantMessage, undefined>>;
    };
    tee(): [AssistantMessageStream, AssistantMessageStream];
}

export { AssistantMessage, AssistantMessageAccumulator, AssistantMessageStream, AssistantStream, AssistantStreamChunk, DataStreamDecoder, DataStreamEncoder, PlainTextDecoder, PlainTextEncoder, ToolExecutionStream, ToolResponse };
