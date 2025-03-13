import { getDateTime } from "./getDateTime";
import { storeSendingLog } from "./sendingLog";

export type LogMessageOptions = {
    addNewline?: boolean;
};

type LogSendingMessageOptions = LogMessageOptions & {
    setFn: React.Dispatch<React.SetStateAction<string[]>>;
};

export const logSendingMessage = (message: string, options: LogSendingMessageOptions) => {
    const { addNewline, setFn } = options;
    const messageWithTime = `${getDateTime()} - ${message}`;
    setFn((prev) => {
        const newValue = [addNewline ? "\u200b" : "", messageWithTime, ...prev]; // Using zero-width space to force newline
        storeSendingLog(newValue);
        return newValue;
    });
};
