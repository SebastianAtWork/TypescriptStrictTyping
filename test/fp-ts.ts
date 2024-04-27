import { Either } from 'effect';
import { uuid } from '../src/model/effect-uuid';
import { CloudTemplateId } from '../src/model/cloud-template-id';

describe('fp-ts and fp-ts-std', () => {
    // Just with these concepts so far, we can already win a lot of error tolerance and developer experience.
    // But we dont have to implement this everywhere ourself and we can harness a existing library to get started running.
    // I researched different ts libraries for result types and the most promising is https://github.com/gcanti/fp-ts
    // Just that they define a more general Result type called Either<Left,Right>, where Right is right and Left is the error
    // We can easily alias this with different types of Results, for example the often used string error:
    type Result<T> = Either.Either<string, T>;
    // Or in case of form validation, a ValidationResult with multiple error messages:
    type ValidationResult<T> = Either.Either<string[], T>;
    // fp-ts however still needs a glue package for common js methods. https://samhh.github.io/fp-ts-std/ fills in that spot
    // With this, we can access env variables or Dom elements safely

    it('Either Utilities', () => {});
    it('Pipe and Flow', () => {});
    it('Pipe and Flow with Either', () => {});
    it('Pipe and Flow with TaskEither', () => {});
    it('Effect Library?', () => {
        const contentTemplateId = uuid('d5df3d22-c22a-942a-f0ca-c883442ed1fb').pipe(Either.getOrThrow);
        if (contentTemplateId !== '') {
            console.log('Test');
        }

        const cloudTemplateId = CloudTemplateId('774b5e5b-2825-d2b9-62e7-03da188ef2cd').pipe(Either.getOrThrow);
    });
});
