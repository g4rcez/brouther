import { DocumentPage } from "../components/document-page";
import { Anchor } from "../components/anchor";
import { Link } from "brouther";
import { router } from "../router";
import { InlineCode } from "../components/inline-code";
import { Code } from "../components/code";
import { SubTitle } from "../components/subtitle";
import { Callout } from "../components/callout";
import { Paths, QueryString } from "../../../src";
import { X } from "../../../src/types/x";

const jsonNotationOutput = `{
    person: { name: "Name" },
    address: { number: 1000 },
    languages: [ { name: "Typescript" } ]
}`;

export default function FormPage() {
    return (
        <DocumentPage title="Form">
            <p>
                This component make you able to use the{" "}
                <Anchor as={Link} href={router.links.actions}>
                    actions
                </Anchor>{" "}
                and the special behaviour to submit forms using JSON notation, inspired by{" "}
                <Anchor target="blank" href="https://www.w3.org/TR/html-json-forms/">
                    HTML JSON Forms
                </Anchor>
                .
            </p>
            <SubTitle as="h3">HTML JSON Forms</SubTitle>
            <p>
                This feature enable you to use the JSON notation at HTML inputs. You just need to wrap your form using the{" "}
                <InlineCode>{"<Form method='method' enctype='json'>"}</InlineCode> and enjoy. Your HTML inputs can have this pattern:
            </p>
            <ul>
                <li>
                    <InlineCode>person.name</InlineCode>
                </li>
                <li>
                    <InlineCode>address.number</InlineCode>
                </li>
                <li>
                    <InlineCode>languages[0].name</InlineCode>
                </li>
            </ul>
            <p>
                Using this notation, Form will submit your <i>HTMLFormElement</i> as JSON following the rules and values
            </p>
            <Code code={jsonNotationOutput} />
            <SubTitle as="h3">Http Methods</SubTitle>
            <p>
                Different of native HTML Form, Brouther.Form accepts:
                <ul>
                    <li>delete</li>
                    <li>get</li>
                    <li>patch</li>
                    <li>post</li>
                    <li>put</li>
                </ul>
                <p>This is a different behavior of native Form, because native forms accept only, get, post and dialog.</p>
            </p>
            <Callout title="Warning">
                Remember, <InlineCode>Date</InlineCode> aren't part of the specification. You need to parse your date from a string. Your values can
                be <Anchor href="https://developer.mozilla.org/en-US/docs/Glossary/Primitive">primitives</Anchor> or arrays/object using the
                primitives as values.
            </Callout>
            <p>Really cool, right? Just drop your stage manager for forms and embrace this notation.</p>
            <SubTitle as="h3">How to connect actions?</SubTitle>
            <p>
                When you create your forms, you need to give the method of your actions. If all your data are validated by{" "}
                <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/ValidityState">Validity State</Anchor> Form will submit using the{" "}
                <InlineCode>method</InlineCode>. Brouther will catch the correct method from your router config and pass all arguments
            </p>
            <ul>
                <li>
                    <b>data</b>: any type of data from your router config.
                </li>
                <li>
                    <b>path</b>: the current path
                </li>
                <li>
                    <b>request</b>: An instance of <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request Web API</Anchor>
                </li>
                <li>
                    <b>queryString</b>: all queryString parameters of given URL
                </li>
                <li>
                    <b>paths</b>: all parameters of current route
                </li>
            </ul>
        </DocumentPage>
    );
}
