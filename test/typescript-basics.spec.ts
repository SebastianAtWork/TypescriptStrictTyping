/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Typescript Basics', () => {
    it('Basic Data Types', () => {
        // TypeScript has all the usual elementary data types, but the names are maybe a bit unfamiliar
        const boolish: boolean = true;

        const text: string = 'Bla';
        // Dont use the object wrapper. The data type above is way better handled in typescript.
        const alsoText: string = String('Bla');

        // Number in TypeScript is both int and float
        const number: number = 2;
        const numberFloating: number = 2.8;

        // Arrays can be created in a few different ways, but the Array initializer is the shortest
        const array: string[] = ['bla'];
        const array2: Array<string> = ['bla'];
        const array3: Array<string> = new Array<string>('bla');

        // Tuples are basically an array of types
        // ? means that the element is optional aka. can be undefined
        const staff: [number, string, string, string?] = [0, 'Adankwo', 'adankwo.e@'];
        // And upon indexing, you are type safe
        const element = staff[0];
        // Since it was optional, it's potentially undefined. More to that later
        const notSure = staff[3];

        // If you don't know how many elements something has, but you know the type, you can use the spread operator
        type PayStubs = [[number, string, string, string?], ...number[]];

        const payStubs: PayStubs[] = [
            [staff, 250],
            [staff, 250, 260],
            [staff, 300, 300, 300],
        ];
    });

    it('types vs interfaces', () => {
        // There are two main tools to declare the shape of an
        // object: interfaces and type aliases.
        //
        // They are very similar, and for the most common cases
        // act the same.

        type BirdType = {
            wings: 'Hallo';
        };
        const bla = 'Hi';

        interface BirdInterface {
            wings: 2;
        }

        const bird1: BirdType = { wings: 2 };
        const bird2: BirdInterface = { wings: 2 };

        // Because TypeScript is a structural type system,
        // it's possible to intermix their use too.

        const bird3: BirdInterface = bird1;

        // They both support extending other interfaces and types.
        // Type aliases do this via intersection types, while
        // interfaces have a keyword.

        type Owl = { nocturnal: true } & BirdType;
        type Robin = { nocturnal: false } & BirdInterface;

        interface Peacock extends BirdType {
            colourful: true;
            flies: false;
        }

        interface Chicken extends BirdInterface {
            colourful: false;
            flies: false;
        }

        let owl: Owl = { wings: 2, nocturnal: true };
        let chicken: Chicken = { wings: 2, colourful: false, flies: false };

        // That said, we recommend you use interfaces over type
        // aliases. Specifically, because you will get better error
        // messages. If you hover over the following errors, you can
        // see how TypeScript can provide terser and more focused
        // messages when working with interfaces like Chicken.

        owl = chicken;
        chicken = owl;

        // One major difference between type aliases vs interfaces
        // are that interfaces are open and type aliases are closed.
        // This means you can extend an interface by declaring it
        // a second time.

        interface Kitten {
            purrs: boolean;
        }

        interface Kitten {
            colour: string;
        }

        // In the other case a type cannot be changed outside of
        // its declaration.

        type Puppy = {
            color: string;
        };

        type Puppy = {
            toys: number;
        };

        // Depending on your goals, this difference could be a
        // positive or a negative. However, for publicly exposed
        // types it's a better call to make them an interface.

        // remark: But you get the best result when combining types and interfaces, more to that here :
        // Also what are classes?
        // https://plainenglish.io/blog/when-to-best-use-type-class-or-interface-in-typescript-73bf66de19e9

        // One of the best resources for seeing all of the edge
        // cases around types vs interfaces, this stack overflow
        // thread is a good place to start:

        // https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220
    });

    it('Structural type system', () => {
        // TypeScript is a Structural Type System. A structural type
        // system means that when comparing types, TypeScript only
        // takes into account the members on the type.

        // This is in contrast to nominal type systems, where you
        // could create two types but could not assign them to each
        // other. See example:nominal-typing

        // For example, these two interfaces are completely
        // transferable in a structural type system:

        interface Ball {
            diameter: number;
        }

        interface Sphere {
            diameter: number;
        }

        let ball: Ball = { diameter: 10 };
        let sphere: Sphere = { diameter: 20 };

        sphere = ball;
        ball = sphere;

        // If we add in a type which structurally contains all of
        // the members of Ball and Sphere, then it also can be
        // set to be a ball or sphere.

        interface Tube {
            diameter: number;
            length: number;
        }

        let tube: Tube = { diameter: 12, length: 3 };

        tube = ball;
        ball = tube;

        // Because a ball does not have a length, then it cannot be
        // assigned to the tube variable. However, all of the members
        // of Ball are inside tube, and so it can be assigned.

        // TypeScript is comparing each member in the type against
        // each other to verify their equality.

        // A function is an object in JavaScript and it is compared
        // in a similar fashion. With one useful extra trick around
        // the params:

        let createBall = (diameter: number) => ({ diameter });
        let createSphere = (diameter: number, useInches: boolean) => {
            return { diameter: useInches ? diameter * 0.39 : diameter };
        };

        createSphere = createBall;
        createBall = createSphere;

        // TypeScript will allow (number) to equal (number, boolean)
        // in the parameters, but not (number, boolean) -> (number)

        // TypeScript will discard the boolean in the first assignment
        // because it's very common for JavaScript code to skip passing
        // params when they're not needed.

        // For example the array's forEach's callback has three params,
        // value, index and the full array - if TypeScript didn't
        // support discarding parameters, then you would have to
        // include every option to make the functions match up:

        [createBall(1), createBall(2)].forEach((ball, _index, _balls) => {
            console.log(ball);
        });

        // No one needs that.

        // Return types are treated like objects, and any differences
        // are compared with the same object equality rules above.

        let createRedBall = (diameter: number) => ({ diameter, color: 'red' });

        createBall = createRedBall;
        createRedBall = createBall;

        // Where the first assignment works (they both have diameter)
        // but the second doesn't (the ball doesn't have a color).
    });

    it('Literal', () => {
        // TypeScript has some fun special cases for literals in
        // source code.

        // In part, a lot of the support is covered in type widening
        // and narrowing ( example:type-widening-and-narrowing ) and it's
        // worth covering that first.

        // A literal is a more concrete subtype of a collective type.
        // What this means is that "Hello World" is a string, but a
        // string is not "Hello World" inside the type system.

        const helloWorld = 'Hello World';
        const hiWorld = 'Hi World'; // this is a string because it is let

        // This function takes all strings
        declare function allowsAnyString(arg: string);

        allowsAnyString(helloWorld);
        allowsAnyString(hiWorld);

        // This function only accepts the string literal "Hello World"
        declare function allowsOnlyHello(arg: 'Hello World');

        allowsOnlyHello(helloWorld);
        allowsOnlyHello(hiWorld);

        // This lets you declare APIs which use unions to say it
        // only accepts a particular literal:

        declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);

        allowsFirstFiveNumbers(1);
        allowsFirstFiveNumbers(10);

        const potentiallyAnyNumber = 3;
        allowsFirstFiveNumbers(potentiallyAnyNumber);

        // At first glance, this rule isn't applied to complex objects.

        const myUser = {
            name: 'Sabrina',
        };

        // See how it transforms `name: "Sabrina"` to `name: string`
        // even though it is defined as a constant. This is because
        // the name can still change any time:

        myUser.name = 'Cynthia';

        // Because myUser's name property can change, TypeScript
        // cannot use the literal version in the type system. There
        // is a feature which will allow you to do this however.

        const myUnchangingUser = {
            name: 'Fatma',
        } as const;

        // When "as const" is applied to the object, then it becomes
        // a object literal which doesn't change instead of a
        // mutable object which can.

        myUnchangingUser.name = 'Raîssa';

        // "as const" is a great tool for fixtured data, and places
        // where you treat code as literals inline. "as const" also
        // works with arrays:

        const exampleUsers = [{ name: 'Brian' }, { name: 'Fahrooq' }] as const;
    });
});
