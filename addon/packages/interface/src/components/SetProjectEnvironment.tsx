import { ProjectEnvironment } from "../types/types";
import { useStoreActions } from "../hooks/storeHooks";
import App from "./App";

export default function SetProjectEnvironment() {
    const environment: ProjectEnvironment = "addon";

    const sendEmail = useStoreActions((actions) => actions.sendEmail);

    return <App environment={environment} sendEmailFn={sendEmail} />;
}
