import { useEffect, useState } from "react";
import { ListIcon } from "ui-kit";
import { MenuOption, MenuView } from "ui-kit";
import { readSendingLog } from "../helpers/sendingLog";
import { showFullSendingLogDialog } from "../helpers/showFullSendingLogDialog";
import { useStoreActions } from "../store/store";

type Props = {
    view: MenuView;
    onClose: () => void;
};

const MenuOptionFullSendingLog = ({ view, onClose }: Props) => {
    const setUserDialog = useStoreActions((actions) => actions.userDialog.setUserDialog);
    const [fullSendingLog, setFullSendingLog] = useState<string[]>([]);

    useEffect(() => {
        const getFullSendingLog = async () => {
            const log = await readSendingLog();
            setFullSendingLog(log.reverse());
        };
        void getFullSendingLog();
    }, []);

    const onSelectMenuOption = () => {
        showFullSendingLogDialog({ fullSendingLog, setUserDialog });
        onClose();
    };

    return (
        <>
            <MenuOption view={view} text={"View full sending log"} onSelect={onSelectMenuOption} icon={<ListIcon />} />
        </>
    );
};

export default MenuOptionFullSendingLog;
