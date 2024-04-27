// We can use union types to make our intent with result clear to the compiler
export type Result<T> =
    | {
          result: T;
          success: true;
      }
    | {
          success: false;
          error: string;
      };

// And write some neat utility functions
export namespace Result {
    export function Fail(error: string): Result<any> {
        return { success: false, error: error };
    }

    export function Success<T>(result: T): Result<T> {
        return { success: true, result: result };
    }
}
