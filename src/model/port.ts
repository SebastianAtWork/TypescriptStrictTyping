const portRegex =
    /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;
// Method to deactivate structural typing
// Since this symbol is not exported and needed for the class Port, Port cannot be created outside
// of this file and is not structural equivalent to anything else
declare const PortType: unique symbol;

class Port {
    // Look at the created javascript --> This is erased after transpiling
    [PortType]!: void;
    readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    // Single point of creation
    static create(value: string): Port {
        if (!portRegex.test(value)) {
            throw `Invalid port: ${value}`;
        }
        return new Port(value);
    }
}

// We can choose to only export the type, not the class. This encapsulates our implementation better
export type { Port };

export default function createPort(value: string) {
    return Port.create(value);
}
