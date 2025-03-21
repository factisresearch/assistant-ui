import { ChatModelAdapter, ChatModelRunOptions } from "../local/ChatModelAdapter";
import { ChatModelRunResult } from "../local/ChatModelAdapter";
import { ThreadMessage } from "../../types";
export declare function asAsyncIterable<T>(source: ReadableStream<T>): AsyncIterable<T>;
type HeadersValue = Record<string, string> | Headers;
export type EdgeChatAdapterOptions = {
    api: string;
    /**
     * Callback function to be called when the API response is received.
     */
    onResponse?: (response: Response) => void | Promise<void>;
    /**
     * Optional callback function that is called when the assistant message is finished streaming.
     */
    onFinish?: (message: ThreadMessage) => void;
    /**
     * Callback function to be called when an error is encountered.
     */
    onError?: (error: Error) => void;
    credentials?: RequestCredentials;
    /**
     * Headers to be sent with the request.
     * Can be a static headers object or a function that returns a Promise of headers.
     */
    headers?: HeadersValue | (() => Promise<HeadersValue>);
    body?: object;
    /**
     * @deprecated Renamed to `sendExtraMessageFields`.
     */
    unstable_sendMessageIds?: boolean;
    /**
     * When enabled, the adapter will not strip `id` from messages in the messages array.
     */
    sendExtraMessageFields?: boolean;
    /**
     * When enabled, the adapter will send messages in the format expected by the Vercel AI SDK Core.
     * This feature will be removed in the future in favor of a better solution.
     *
     * `v2` sends frontend tools in a format that can be directly passed to `stremaText`
     */
    unstable_AISDKInterop?: boolean | "v2" | undefined;
};
export declare class EdgeChatAdapter implements ChatModelAdapter {
    private options;
    constructor(options: EdgeChatAdapterOptions);
    run({ messages, runConfig, abortSignal, context, unstable_assistantMessageId, unstable_getMessage, }: ChatModelRunOptions): AsyncGenerator<ChatModelRunResult, void, unknown>;
}
export {};
//# sourceMappingURL=EdgeChatAdapter.d.ts.map