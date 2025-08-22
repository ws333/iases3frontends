import { store } from "../store/store";
import { getLogsToDisplay } from "./sendingLog";

export async function updateSendingLogState() {
    const log = await getLogsToDisplay();
    store.getActions().sendingLog.setLog(log);
}
