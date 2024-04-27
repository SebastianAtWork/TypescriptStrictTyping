import { Brand } from 'effect';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export namespace UUID {
    export function IsValid(value: string) {
        return uuidRegex.test(value);
    }
}

export type uuid = string & Brand.Brand<'uuid'>;
export const uuid = (value: string) =>
    Brand.refined<uuid>(
        (n) => UUID.IsValid(n),
        (n) => Brand.error(`Not a valid UUID : ${n}`),
    ).either(value);
