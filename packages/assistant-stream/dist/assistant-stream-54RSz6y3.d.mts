type ReadonlyJSONValue = null | string | number | boolean | ReadonlyJSONObject | ReadonlyJSONArray;
type ReadonlyJSONObject = {
    readonly [key: string]: ReadonlyJSONValue;
};
type ReadonlyJSONArray = readonly ReadonlyJSONValue[];

type PartInit = {
    readonly type: "text" | "reasoning";
} | {
    readonly type: "tool-call";
    readonly toolCallId: string;
    readonly toolName: string;
} | {
    readonly type: "source";
    readonly sourceType: "url";
    readonly id: string;
    readonly url: string;
    readonly title?: string;
} | {
    readonly type: "file";
    readonly data: string;
    readonly mimeType: string;
};
type AssistantStreamChunk = {
    readonly path: readonly number[];
} & ({
    readonly type: "part-start";
    readonly part: PartInit;
} | {
    readonly type: "part-finish";
} | {
    readonly type: "tool-call-args-text-finish";
} | {
    readonly type: "text-delta";
    readonly textDelta: string;
} | {
    readonly type: "annotations";
    readonly annotations: ReadonlyJSONValue[];
} | {
    readonly type: "data";
    readonly data: ReadonlyJSONValue[];
} | {
    readonly type: "step-start";
    readonly messageId: string;
} | {
    readonly type: "step-finish";
    readonly finishReason: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown";
    readonly usage: {
        readonly promptTokens: number;
        readonly completionTokens: number;
    };
    readonly isContinued: boolean;
} | {
    readonly type: "message-finish";
    readonly finishReason: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown";
    readonly usage: {
        readonly promptTokens: number;
        readonly completionTokens: number;
    };
} | {
    readonly type: "result";
    readonly artifact?: ReadonlyJSONValue | undefined;
    readonly result: ReadonlyJSONValue;
    readonly isError: boolean;
} | {
    readonly type: "error";
    readonly error: string;
});

type AssistantStreamEncoder = ReadableWritablePair<Uint8Array, AssistantStreamChunk> & {
    headers?: Headers;
};
type AssistantStream = ReadableStream<AssistantStreamChunk>;
declare const AssistantStream: {
    toResponse(stream: AssistantStream, transformer: AssistantStreamEncoder): Response;
    fromResponse(response: Response, transformer: ReadableWritablePair<AssistantStreamChunk, Uint8Array>): ReadableStream<AssistantStreamChunk>;
    toByteStream(stream: AssistantStream, transformer: ReadableWritablePair<Uint8Array, AssistantStreamChunk>): ReadableStream<Uint8Array<ArrayBufferLike>>;
    fromByteStream(readable: ReadableStream<Uint8Array>, transformer: ReadableWritablePair<AssistantStreamChunk, Uint8Array>): ReadableStream<AssistantStreamChunk>;
};

type TextStreamController = {
    append(textDelta: string): void;
    close(): void;
};

declare const TOOL_RESPONSE_SYMBOL: unique symbol;
type ToolResponseInit<TResult> = {
    result: TResult;
    artifact?: ReadonlyJSONValue | undefined;
    isError?: boolean | undefined;
};
declare class ToolResponse<TResult> {
    get [TOOL_RESPONSE_SYMBOL](): boolean;
    readonly artifact?: ReadonlyJSONValue | undefined;
    readonly result: TResult;
    readonly isError: boolean;
    constructor(options: ToolResponseInit<TResult>);
    static [Symbol.hasInstance](obj: unknown): obj is ToolResponse<unknown>;
}

type ToolCallStreamController = {
    argsText: TextStreamController;
    setResponse(response: ToolResponseInit<ReadonlyJSONValue>): void;
    close(): void;
};

type TextStatus = {
    type: "running";
} | {
    type: "complete";
    reason: "stop" | "unknown";
} | {
    type: "incomplete";
    reason: "cancelled" | "length" | "content-filter" | "other";
};
type TextPart = {
    type: "text";
    text: string;
    status: TextStatus;
};
type ReasoningPart = {
    type: "reasoning";
    text: string;
    status: TextStatus;
};
type ToolCallStatus = {
    type: "running";
    isArgsComplete: boolean;
} | {
    type: "requires-action";
    reason: "tool-call-result";
} | {
    type: "complete";
    reason: "stop" | "unknown";
} | {
    type: "incomplete";
    reason: "cancelled" | "length" | "content-filter" | "other";
};
type ToolCallPart = {
    type: "tool-call";
    state: "partial-call" | "call" | "result";
    status: ToolCallStatus;
    toolCallId: string;
    toolName: string;
    argsText: string;
    args: ReadonlyJSONObject;
    artifact?: unknown;
    result?: ReadonlyJSONValue;
    isError?: boolean;
};
type SourcePart = {
    type: "source";
    sourceType: "url";
    id: string;
    url: string;
    title?: string;
};
type FilePart = {
    type: "file";
    data: string;
    mimeType: string;
};
type AssistantMessagePart = TextPart | ReasoningPart | ToolCallPart | SourcePart | FilePart;
type AssistantMessageStepUsage = {
    promptTokens: number;
    completionTokens: number;
};
type AssistantMessageStepMetadata = {
    state: "started";
    messageId: string;
} | {
    state: "finished";
    messageId: string;
    finishReason: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown";
    usage?: AssistantMessageStepUsage;
    isContinued: boolean;
};
type AssistantMessageStatus = {
    type: "running";
} | {
    type: "requires-action";
    reason: "tool-calls";
} | {
    type: "complete";
    reason: "stop" | "unknown";
} | {
    type: "incomplete";
    reason: "cancelled" | "tool-calls" | "length" | "content-filter" | "other" | "error";
    error?: ReadonlyJSONValue;
};
type AssistantMessage = {
    role: "assistant";
    status: AssistantMessageStatus;
    parts: AssistantMessagePart[];
    /**
     * @deprecated Use `parts` instead.
     */
    content: AssistantMessagePart[];
    metadata: {
        unstable_data: ReadonlyJSONValue[];
        unstable_annotations: ReadonlyJSONValue[];
        steps: AssistantMessageStepMetadata[];
        custom: Record<string, unknown>;
    };
};

type ToolCallPartInit = {
    toolCallId?: string;
    toolName: string;
    argsText?: string;
    args?: ReadonlyJSONObject;
    response?: ToolResponseInit<ReadonlyJSONValue>;
};
type AssistantStreamController = {
    appendText(textDelta: string): void;
    appendReasoning(reasoningDelta: string): void;
    appendSource(options: SourcePart): void;
    appendFile(options: FilePart): void;
    addTextPart(): TextStreamController;
    addToolCallPart(options: string): ToolCallStreamController;
    addToolCallPart(options: ToolCallPartInit): ToolCallStreamController;
    enqueue(chunk: AssistantStreamChunk): void;
    merge(stream: AssistantStream): void;
    close(): void;
};
declare function createAssistantStream(callback: (controller: AssistantStreamController) => PromiseLike<void> | void): AssistantStream;
declare function createAssistantStreamResponse(callback: (controller: AssistantStreamController) => PromiseLike<void> | void): Response;

export { AssistantStream as A, type ReadonlyJSONValue as R, ToolResponse as T, type AssistantStreamChunk as a, type AssistantStreamController as b, type AssistantMessage as c, type AssistantStreamEncoder as d, createAssistantStream as e, createAssistantStreamResponse as f };
