import { useStoreActions } from "../hooks/storeHooks";
import { getProjectEnvironment } from "../helpers/getProjectEnvironment";
import App from "./App";

export default function ProjectEnvironment() {
    const environment = getProjectEnvironment();

    const sendEmail = useStoreActions((actions) => actions.sendEmail);

    return <App environment={environment} sendEmailFn={sendEmail} />;
}
