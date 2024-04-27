import { Port } from '../src/model/port';
import { PortWithValidation } from '../src/model/port-with-validation';
import { Result } from '../src/model/result';

describe('Always valid domain modelling', () => {
    // With all of the previous insights, how can we let the compiler help us?
    it('Domain model', () => {
        // From txx-libs VraClient
        async function deleteCloudTemplate(tenant: string, id: string);

        // What is the format of a tenant string? int22ec9bac7  or https://int22ec9bac7.integration.telemaxx.cloud/ ?
        // Only way to know, is to check another call and hope, that the code there works.
        // If we had a Tenant Type and a TenantUrl Type, we could be clear about this.

        // This is the shortest way of defining a "branded" type, aka something as close to a string as possible, but with typescript compiler help
        type Tenant = string & {
            __brand: 'The shortcode to identify a tenant, but without information about the vra Instance, it exists in.';
        };

        const tenant = 'int22ec9bac7' as Tenant;
        // If we look at the javascript, that gets produced, this is exactly the same, as just doing const tenant = 'int22ec9bac7';
        // So no performance is lost at runtime.

        // The same with id. What kind of id? It only works with a Blueprint id.
        // But that is vra internal naming. For the user and therefore, for our Domain, it is called Cloud Template.
        type CloudTemplateId = string & {
            __brand: 'The cloud template id, internally called blueprint id.';
        };

        const id = '944b8753-bf42-4852-ad1d-62dc10e1ed66' as CloudTemplateId;

        // With both of that, the method looks a lot more developer friendly. Not only that, when calling this method,
        // Jetbrains and VsCode can help by only showing us CloudTemplateId´s as intellisense recommendations.
        async function deleteCloudTemplate(tenant: Tenant, id: CloudTemplateId);

        // But these branded types actually use a peculiarity of typescript, they use the value literals to make the type Nominal.
        // The text in the __brand has to be unique, to actually make the type Nominal.
        // Also, you can create the type however you want. We just declared that we want a Tenant, not how a Tenant has to be created in order for it to be valid.
    });
    it('Valid domain model', () => {
        // Switch to a simpler function
        function listenToPort(port: string): Promise<string>;
        // It might not look like much, but this is a case of lost potential for compiler help
        // ports can be represented in a few different ways
        // And the string could be empty

        // Look at class port.ts
        // Now any method using this can be sure (guaranteed by the compiler and tests)
        // That Port is a valid Port
        // It reads better and documents the requirements for a port in itself
        function listenToPort(port: Port): Promise<string>;
    });

    it('Always valid domain model', () => {
        // Lets look again, at the creation of a port:
        // static create(value: string): Port {
        //         if (!portRegex.test(value)) {
        //             throw `Invalid port: ${value}`;
        //         }
        //         return new Port(value);
        //     }
        // The signature is actually lying to us. There is easily a way to break the whole program in this.
        // If nobody handles the throw outside of this method, we have a problem.
        // And if we wrap too much inside a try catch, we cannot reason about where it failed and what to do.
        // So why not put, how we should handle this method, into the signature and let typescript help.
        // Look at result.ts
        // Look at port-with-validation.ts
        //
        // Inside this Method, we can expect the port to be a valid, not null or undefined port in a certain format.
        function listenToPort(port: PortWithValidation): Promise<string>;

        // And as an extra, since listenToPort can fail in various ways, we can also use Result here:
        function listenToPortSafe(port: Port): Promise<Result<string>>;

        // As far as how many types we want to take into our domain models, I think we should at least consider offline,
        // synchronously validatable types. Tenant for example, has certain formatting rules behind it. So do uuids.
        // We should definitely not include models, that can be invalid over time, like FreePort or ExistingId.
        // These can be instances of their respective type (Port or Tenant) with the usual variable naming, but they are not guarantee-able by the type system.
        // Also, types can be improved upon / wrapped to make them more specific.
        // Look at cloudtemplateid.ts
        //
        // Also, we should start with single element types, but there may also be some more complex types, that can still be validated  this way
});