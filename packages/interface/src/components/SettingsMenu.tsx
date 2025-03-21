import { Menu, MenuOption, MenuOptionProps, OpenMenuButton } from "radzionkit";
import { DownloadIcon } from "radzionkit/ui/icons/DownloadIcon";
import { EditIcon } from "radzionkit/ui/icons/EditIcon";
import { MoonIcon } from "radzionkit/ui/icons/MoonIcon";
import { TrashBinIcon } from "radzionkit/ui/icons/TrashBinIcon";
import { useStoreActions } from "../hooks/storeHooks";
import { exportLocalStorage } from "../helpers/exportLocalStorage";
import { showDeleteHistoryDialog } from "../helpers/showDeleteHistoryDialog";

function SettingsMenu() {
    const setUserDialog = useStoreActions((actions) => actions.userDialog.setUserDialog);
    const initiateForcedRender = useStoreActions((actions) => actions.contactList.initiateForcedRender);

    return (
        <Menu
            title="Settings"
            renderOpener={({ props: { ref, ...props } }) => <OpenMenuButton ref={ref} {...props} />}
            renderContent={({ view, onClose }) => {
                const options: MenuOptionProps[] = [
                    {
                        text: "View stats",
                        onSelect: () => {
                            onClose();
                        },
                        icon: <EditIcon />,
                    },
                    {
                        text: "Reset stats",
                        onSelect: () => {
                            onClose();
                        },
                        icon: <MoonIcon />,
                    },
                    {
                        text: "Export sending data",
                        onSelect: () => {
                            exportLocalStorage();
                            onClose();
                        },
                        icon: <DownloadIcon />,
                    },
                    {
                        text: "Reset all data",
                        kind: "alert",
                        onSelect: () => {
                            showDeleteHistoryDialog({ initiateForcedRender, setUserDialog });
                            onClose();
                        },
                        icon: <TrashBinIcon />,
                    },
                ];

                return options.map((props, index) => <MenuOption view={view} key={index} {...props} />);
            }}
        />
    );
}
export default SettingsMenu;
