import { Result } from './result';
import createUUIDWithValidation, { UUIDWithValidation } from './uuid';

declare const CloudTemplateIdType: unique symbol;

class CloudTemplateId {
    [CloudTemplateIdType]!: void;
    readonly uuid: UUIDWithValidation;

    private constructor(uuid: UUIDWithValidation) {
        this.uuid = uuid;
    }

    static create(value: string): Result<CloudTemplateId> {
        const uuidResult = createUUIDWithValidation(value);
        if (!uuidResult.success) {
            return Result.Fail(`Invalid Cloud Template ID: ${value}`);
        }
        return Result.Success(new CloudTemplateId(uuidResult.result));
    }
}

export type { CloudTemplateId };

export default function createCloudTemplateId(value: string): Result<CloudTemplateId> {
    return CloudTemplateId.create(value);
}
