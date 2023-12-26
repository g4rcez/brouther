import { DocumentPage } from "../components/document-page";
import { Code } from "../components/code";
import { SubTitle } from "../components/subtitle";

const PackageManagers = [
    { title: "npm", code: "npm install -E r" },
    { title: "pnpm", code: "pnpm add -E r" },
    { title: "yarn", code: "yarn add -E r" },
];

export default function InstallPage() {
    return (
        <DocumentPage title="How to Install?">
            First of all, you need to install brouther using your favorite package manager.
            {PackageManagers.map((x) => (
                <div className="w-full my-2" key={`package-manager-${x.title}`}>
                    <SubTitle>{x.title}</SubTitle>
                    <Code code={x.code} />
                </div>
            ))}
        </DocumentPage>
    );
}
