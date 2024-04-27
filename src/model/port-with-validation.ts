import { Result } from './result';

const portRegex =
    /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;
declare const PortType: unique symbol;

// Dont actually call it WithValidation. This is only because I have the previous example.
class PortWithValidation {
    [PortType]!: void;
    readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    // This now correctly handles the 2 possible paths (not included a serious system exception, where we couldn´t continue anyway)
    static create(value: string): Result<PortWithValidation> {
        if (!portRegex.test(value)) {
            return Result.Fail(`Invalid port: ${value}`);
        }
        return Result.Success(new PortWithValidation(value));
    }
}

export type { PortWithValidation };

export default function createPortWithValidation(value: string) {
    return PortWithValidation.create(value);
}
