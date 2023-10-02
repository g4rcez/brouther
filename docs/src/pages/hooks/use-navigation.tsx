import { DocumentPage } from "../../components/document-page";
import { InlineCode } from "../../components/inline-code";
import { NavigationDocument } from "../../components/docs/navigation";

export default function UseNavigationPage() {
    return (
        <DocumentPage title="useNavigation">
            <p>
                This hook return a <InlineCode>navigation</InlineCode> object to manipulate the browser history
            </p>
            <NavigationDocument />
        </DocumentPage>
    );
}
