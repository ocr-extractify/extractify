import { z } from "zod";

/**
 * A function that validates the uniqueness of specified keys in an array of objects.
 *
 * @template T - The type of objects in the array.
 * @param uniqueKeys - An array of objects specifying the keys to check for uniqueness and the corresponding error messages.
 * @returns A function that takes an array of objects and a Zod refinement context, and adds issues to the context if any of the specified keys are not unique.
 *
 * @example
 * ```typescript
 * const validateUnique = unique<{ id: number; email: string }>([
 *   { key: 'id', message: 'ID must be unique' },
 *   { key: 'email', message: 'Email must be unique' },
 * ]);
 *
 * const data = [
 *   { id: 1, email: 'test@example.com' },
 *   { id: 2, email: 'test@example.com' },
 * ];
 *
 * const ctx = { addIssue: (issue) => console.log(issue) };
 * validateUnique(data, ctx);
 * // Output: { code: 'custom', message: 'Email must be unique', path: [1, 'email'] }
 * ```
 */
export default function unique<T extends object>(
  uniqueKeys: { key: keyof T; message: string }[]
) {
  return (data: T[], ctx: z.RefinementCtx) => {
    uniqueKeys.forEach(({ key, message }) => {
      const seen = new Set();
      data.forEach((item, index) => {
        const value = item[key];
        if (seen.has(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
            path: [index, key.toString()], // .toString() in case `key` is typeof `symbol`. 
          });
        } else {
          seen.add(value);
        }
      });
    });
  };
}