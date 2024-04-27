import { Result } from './result';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
declare const UUIDType: unique symbol;

class UUIDWithValidation {
    [UUIDType]!: void;
    readonly value: string;

    private constructor(value: string) {
        this.value = value.toLowerCase(); // Convert UUID to lowercase
    }

    static create(value: string): Result<UUIDWithValidation> {
        if (!uuidRegex.test(value)) {
            return Result.Fail(`Invalid UUID: ${value}`);
        }
        return Result.Success(new UUIDWithValidation(value));
    }
}

export type { UUIDWithValidation };

export default function createUUIDWithValidation(value: string): Result<UUIDWithValidation> {
    return UUIDWithValidation.create(value);
}

export function IsUUID(value: string) {
    return uuidRegex.test(value);
}
