import { TEmailComponent } from "../types/types";

type EmailPreviewProps = {
    Component: TEmailComponent;
    name: string;
};

function EmailPreview({ name, Component }: EmailPreviewProps) {
    return (
        <div>
            <div className="email_preview_content">
                <Component name={name} />
            </div>
        </div>
    );
}

export default EmailPreview;
