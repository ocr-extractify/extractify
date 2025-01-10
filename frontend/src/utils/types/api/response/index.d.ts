
/**
 * Represents the response from an API call.
 * @template T - The type of the data in the response.
 */
export type APIResponse<T> = {
    data: T;
    // count: number; -> it may be implemented in the future
};
