/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Potential of using the compiler correctly', () => {
    // TypeScript has a lot of ways to turn off the compiler, but also to let the compiler support you in writing a lot more robust code
    // Part of this is to be compatible to javascript
    // But since tools like definetly typed can give typescript definitions for javascript
    // and EcmaScript by now implements a ton of features in javascript, any has to be used very sparingly
    it('Any, unknown and never', () => {
        // Any is the TypeScript escape clause. You can use any to
        // either declare a section of your code to be dynamic and
        // JavaScript like, or to work around limitations in the
        // type system.

        // A good case for any is JSON parsing:

        const myObject = JSON.parse('{}');

        // Any declares to TypeScript to trust your code as being
        // safe because you know more about it. Even if that is
        // not strictly true. For example, this code would crash:

        myObject.x.y.z;

        // Using an any gives you the ability to write code closer to
        // original JavaScript with the trade-off of type safety.

        // any is much like a 'type wildcard' which you can replace
        // with any type (except never) to make one type assignable
        // to the other.

        declare function debug(value: any): void;

        debug('a string');
        debug(23);
        debug({ color: 'blue' });

        // Each call to debug is allowed because you could replace the
        // any with the type of the argument to match.

        // TypeScript will take into account the position of the
        // anys in different forms, for example with these tuples
        // for the function argument.

        declare function swap(x: [number, string]): [string, number];

        declare const pair: [any, any];
        swap(pair);

        // The call to swap is allowed because the argument can be
        // matched by replacing the first any in pair with number
        // and the second `any` with string.

        // If tuples are new to you, see: example:tuples

        // Unknown is a sibling type to any, if any is about saying
        // "I know what's best", then unknown is a way to say "I'm
        // not sure what is best, so you need to tell TS the type"
        // example:unknown-and-never

        // Unknown

        // Unknown is one of those types that once it clicks, you
        // can find quite a lot of uses for it. It acts like a sibling
        // to the any type. Where any allows for ambiguity - unknown
        // requires specifics.

        // A good example would be in wrapping a JSON parser. JSON
        // data can come in many different forms and the creator
        // of the json parsing function won't know the shape of the
        // data - the person calling that function should.

        const jsonParser = (jsonString: string) => JSON.parse(jsonString);

        const myAccount = jsonParser(`{ "name": "Dorothea" }`);

        myAccount.name;
        myAccount.email;

        // If you hover on jsonParser, you can see that it has the
        // return type of any, so then does myAccount. It's possible
        // to fix this with generics - but it's also possible to fix
        // this with unknown.

        const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

        const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

        if (myOtherAccount && myOtherAccoun) {
            myOtherAccount.name;
        }

        // The object myOtherAccount cannot be used until the type has
        // been declared to TypeScript. This can be used to ensure
        // that API consumers think about their typing up-front:

        type User = { name: string };
        const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
        myUserAccount.name;

        // Unknown is a great tool, to understand it more read these:
        // https://mariusschulz.com/blog/the-unknown-type-in-typescript
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

        // Never

        // Because TypeScript supports code flow analysis, the language
        // needs to be able to represent when code logically cannot
        // happen. For example, this function cannot return:

        const neverReturns = () => {
            // If it throws on the first line
            throw new Error('Always throws, never returns');
        };

        // If you hover on the type, you see it is a () => never
        // which means it should never happen. These can still be
        // passed around like other values:

        const myValue = neverReturns();

        // Having a function never return can be useful when dealing
        // with the unpredictability of the JavaScript runtime and
        // API consumers that might not be using types:

        const validateUser = (user: User) => {
            if (user) {
                return user.name !== 'NaN';
            }

            // According to the type system, this code path can never
            // happen, which matches the return type of neverReturns.

            return neverReturns();
        };

        // The type definitions state that a user has to be passed in
        // but there are enough escape valves in JavaScript whereby
        // you can't guarantee that.

        // Using a function which returns never allows you to add
        // additional code in places which should not be possible.
        // This is useful for presenting better error messages,
        // or closing resources like files or loops.

        // A very popular use for never, is to ensure that a
        // switch is exhaustive. E.g., that every path is covered.

        // Here's an enum and an exhaustive switch, try adding
        // a new option to the enum (maybe Tulip?)

        enum Flower {
            Rose,
            Rhododendron,
            Violet,
            Daisy,
            Bla,
        }

        const flowerLatinName = (flower: Flower) => {
            switch (flower) {
                case Flower.Rose:
                    return 'Rosa rubiginosa';
                case Flower.Rhododendron:
                    return 'Rhododendron ferrugineum';
                case Flower.Violet:
                    return 'Viola reichenbachiana';
                case Flower.Daisy:
                    return 'Bellis perennis';

                default:
                    const _exhaustiveCheck: never = flower;
                    return _exhaustiveCheck;
            }
        };

        // You will get a compiler error saying that your new
        // flower type cannot be converted into never.

        // Never in Unions

        // A never is something which is automatically removed from
        // a type union.

        type NeverIsRemoved = string | never | number;

        // If you look at the type for NeverIsRemoved, you see that
        // it is string | number. This is because it should never
        // happen at runtime because you cannot assign to it.

        // This feature is used a lot in example:conditional-types
    });

    it('Nominal Type System', () => {
        // A nominal type system means that each type is unique
        // and even if types have the same data you cannot assign
        // across types.

        // TypeScript's type system is structural, which means
        // if the type is shaped like a duck, it's a duck. If a
        // goose has all the same attributes as a duck, then it also
        // is a duck. You can learn more here: example:structural-typing

        // This can have drawbacks, for example there are cases
        // where a string or number can have special context and you
        // don't want to ever make the values transferrable. For
        // example:
        //
        // -  User Input Strings (unsafe)
        // -  Translation Strings
        // -  User Identification Numbers
        // -  Access Tokens

        // We can get most of the value from a nominal type
        // system with a little bit of extra code.

        // We're going to use an intersectional type, with a unique
        // constraint in the form of a property called __brand (this
        // is convention) which makes it impossible to assign a
        // normal string to a ValidatedInputString.

        type ValidatedInputString = string & { __brand: 'User Input Post Validation' };

        // We will use a function to transform a string to
        // a ValidatedInputString - but the point worth noting
        // is that we're just _telling_ TypeScript that it's true.

        const validateUserInput = (input: string) => {
            const simpleValidatedInput = input.replace(/\</g, '≤');
            return simpleValidatedInput as ValidatedInputString;
        };

        // Now we can create functions which will only accept
        // our new nominal type, and not the general string type.

        const printName = (name: ValidatedInputString) => {
            console.log(name);
        };

        // For example, here's some unsafe input from a user, going
        // through the validator and then being allowed to be printed:

        const input = "alert('bobby tables')";
        const validatedInput = validateUserInput(input);
        printName(validatedInput);

        // On the other hand, passing the un-validated string to
        // printName will raise a compiler error:

        printName(input);

        // You can read a comprehensive overview of the
        // different ways to create nominal types, and their
        // trade-offs in this 400 comment long GitHub issue:
        //
        // https://github.com/Microsoft/TypeScript/issues/202
        //
        // and this post is a great summary:
        //
        // https://michalzalecki.com/nominal-typing-in-typescript/
    });

    it('Union Types', () => {
        // Type unions are a way of declaring that an object
        // could be more than one type.

        type StringOrNumber = string | number;
        type ProcessStates = 'open' | 'closed';
        type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
        type AMessyUnion = 'hello' | 156 | { error: true };

        // If the use of "open" and "closed" vs string is
        // new to you, check out: example:literals

        // We can mix different types into a union, and
        // what we're saying is that the value is one of those types.

        // TypeScript will then leave you to figure out how to
        // determine which value it could be at runtime.

        // Unions can sometimes be undermined by type widening,
        // for example:

        type WindowStates = 'open' | 'closed' | 'minimized' | string;

        // If you hover above, you can see that WindowStates
        // becomes a string - not the union. This is covered in
        // example:type-widening-and-narrowing

        // If a union is an OR, then an intersection is an AND.
        // Intersection types are when two types intersect to create
        // a new type. This allows for type composition.

        interface ErrorHandling {
            success: boolean;
            error?: { message: string };
        }

        interface ArtworksData {
            artworks: { title: string }[];
        }

        interface ArtistsData {
            artists: { name: string }[];
        }

        // These interfaces can be composed in responses which have
        // both consistent error handling, and their own data.

        type ArtworksResponse = ArtworksData & ErrorHandling;
        type ArtistsResponse = ArtistsData & ErrorHandling;

        // For example:

        const handleArtistsResponse = (response: ArtistsResponse) => {
            if (response.error) {
                console.error(response.error.message);
                return;
            }

            console.log(response.artists);
        };

        // A mix of Intersection and Union types becomes really
        // useful when you have cases where an object has to
        // include one of two values:

        interface CreateArtistBioBase {
            artistID: string;
            thirdParty?: boolean;
        }

        type CreateArtistBioRequest = CreateArtistBioBase & ({ html: string } | { markdown: string });

        // Now you can only create a request when you include
        // artistID and either html or markdown

        const workingRequest: CreateArtistBioRequest = {
            artistID: 'banksy',
            markdown: 'Banksy is an anonymous England-based graffiti artist...',
        };

        const badRequest: CreateArtistBioRequest = {
            artistID: 'banksy',
        };
    });

    it('discriminate types', () => {
        // A discriminated type union is where you use code flow
        // analysis to reduce a set of potential objects down to one
        // specific object.
        //
        // This pattern works really well for sets of similar
        // objects with a different string or number constant
        // for example: a list of named events, or versioned
        // sets of objects.

        type TimingEvent = { name: 'start'; userStarted: boolean } | { name: 'closed'; duration: number };

        // When event comes into this function, it could be any
        // of the two potential types.

        const handleEvent = (event: TimingEvent) => {
            // By using a switch against event.name TypeScript's code
            // flow analysis can determine that an object can only
            // be represented by one type in the union.

            switch (event.name) {
                case 'start':
                    // This means you can safely access userStarted
                    // because it's the only type inside TimingEvent
                    // where name is "start"
                    const initiatedByUser = event.userStarted;
                    break;

                case 'closed':
                    const timespan = event.duration;
                    break;
            }
        };

        // This pattern is the same with numbers which we can use
        // as the discriminator.

        // In this example, we have a discriminate union and an
        // additional error state to handle.

        type APIResponses =
            | { version: 0; msg: string }
            | { version: 1; message: string; status: number }
            | { error: string };

        const handleResponse = (response: APIResponses) => {
            // Handle the error case, and then return
            if ('error' in response) {
                console.error(response.error);
                return;
            }

            // TypeScript now knows that APIResponse cannot be
            // the error type. If it were the error, the function
            // would have returned. You can verify this by
            // hovering over response below.

            if (response.version === 0) {
                console.log(response.msg);
            } else if (response.version === 1) {
                console.log(response.status, response.message);
            }
        };

        // You're better off using a switch statement instead of
        // if statements because you can make assurances that all
        // parts of the union are checked. There is a good pattern
        // for this using the never type in the handbook:

        // https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
    });

    it('conditional types', () => {
        // Conditional Types provide a way to do simple logic in the
        // TypeScript type system. This is definitely an advanced
        // feature, and it's quite feasible that you won't need to
        // use this in your normal day to day code.

        // A conditional type looks like:
        //
        //   A extends B ? C : D
        //
        // Where the condition is whether a type extends an
        // expression, and if so what type should be returned.

        // Let's go through some examples, for brevity we're
        // going to use single letters for generics. This is optional
        // but restricting ourselves to 60 characters makes it
        // hard to fit on screen.

        type Cat = { meows: true };
        type Dog = { barks: true };
        type Cheetah = { meows: true; fast: true };
        type Wolf = { barks: true; howls: true };

        // We can create a conditional type which lets extract
        // types which only conform to something which barks.

        type ExtractDogish<A> = A extends { barks: true } ? A : never;

        // Then we can create types which ExtractDogish wraps:

        // A cat doesn't bark, so it will return never
        type NeverCat = ExtractDogish<Cat>;
        // A wolf will bark, so it returns the wolf shape
        type Wolfish = ExtractDogish<Wolf>;

        // This becomes useful when you want to work with a
        // union of many types and reduce the number of potential
        // options in a union:

        type Animals = Cat | Dog | Cheetah | Wolf;

        // When you apply ExtractDogish to a union type, it is the
        // same as running the conditional against each member of
        // the type:

        type Dogish = ExtractDogish<Animals>;

        // = ExtractDogish<Cat> | ExtractDogish<Dog> |
        //   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
        //
        // = never | Dog | never | Wolf
        //
        // = Dog | Wolf (see example:unknown-and-never)

        // This is called a distributive conditional type because
        // the type distributes over each member of the union.

        // Deferred Conditional Types

        // Conditional types can be used to tighten your APIs which
        // can return different types depending on the inputs.

        // For example this function which could return either a
        // string or number depending on the boolean passed in.

        declare function getID<T extends boolean>(fancy: T): T extends true ? string : number;

        // Then depending on how much the type-system knows about
        // the boolean, you will get different return types:

        const stringReturnValue = getID(true);
        const numberReturnValue = getID(false);
        const stringOrNumber = getID(Math.random() < 0.5);

        // In this case above TypeScript can know the return value
        // instantly. However, you can use conditional types in functions
        // where the type isn't known yet. This is called a deferred
        // conditional type.

        // Same as our Dogish above, but as a function instead
        declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

        // There is an extra useful tool within conditional types, which
        // is being able to specifically tell TypeScript that it should
        // infer the type when deferring. That is the 'infer' keyword.

        // infer is typically used to create meta-types which inspect
        // the existing types in your code, think of it as creating
        // a new variable inside the type.

        type GetReturnValue<T> = T extends (...args: any[]) => infer R ? R : T;

        // Roughly:
        //
        //  - this is a conditional generic type called GetReturnValue
        //    which takes a type in its first parameter
        //
        //  - the conditional checks if the type is a function, and
        //    if so create a new type called R based on the return
        //    value for that function
        //
        //  - If the check passes, the type value is the inferred
        //    return value, otherwise it is the original type
        //

        type getIDReturn = GetReturnValue<typeof getID>;

        // This fails the check for being a function, and would
        // just return the type passed into it.
        type getCat = GetReturnValue<Cat>;
    });
});
