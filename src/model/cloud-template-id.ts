import { Brand, Either } from 'effect';
import { uuid } from './effect-uuid';

type CloudTemplateId = string & Brand.Brand<'CloudTemplateId'>;
export const CloudTemplateId = (value: string) => {
    const base = uuid(value);
    return Brand.refined<CloudTemplateId>(
        () => base._tag === 'Right',
        () => base.pipe(Either.flip, Either.getOrThrow),
    ).either(value);
};
