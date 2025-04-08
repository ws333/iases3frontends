import { Menu, MenuOptionProps, OpenMenuButton } from "radzionkit";
import { DownloadIcon } from "radzionkit/ui/icons/DownloadIcon";
import { TrashBinIcon } from "radzionkit/ui/icons/TrashBinIcon";
import styled from "styled-components";
import { useStoreActions } from "../hooks/storeHooks";
import { exportFromLocalStorage } from "../helpers/exportFromLocalStorage";
import { showDeleteHistoryDialog } from "../helpers/showDeleteHistoryDialog";
import MenuOptionFullSendingLog from "./MenuOptionFullSendingLog";
import MenuOptionImport from "./MenuOptionImport";
import { MenuOption } from "./customRadzionkit/MenuOption";

const StyledTitle = styled.span`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.toCssValue()};
`;

function SettingsMenu() {
    const setUserDialog = useStoreActions((actions) => actions.userDialog.setUserDialog);
    const initiateForcedRender = useStoreActions((actions) => actions.render.initiateForcedRender);

    const importSendingHistory = "Import sending history";
    const viewFullSendingLog = "View full sending log";

    return (
        <Menu
            title={<StyledTitle>Settings</StyledTitle>}
            renderOpener={({ props: { ref, ...props } }) => <OpenMenuButton ref={ref} {...props} />}
            renderContent={({ view, onClose }) => {
                const options: MenuOptionProps[] = [
                    {
                        // Dummy to position menu option in MenuList below
                        text: viewFullSendingLog,
                        onSelect: () => {},
                    },
                    {
                        text: "Export sending history",
                        onSelect: () => {
                            exportFromLocalStorage();
                            onClose();
                        },
                        icon: <DownloadIcon />,
                    },
                    {
                        // Dummy to position menu option in MenuList below
                        text: importSendingHistory,
                        onSelect: () => {},
                    },
                    {
                        text: "Reset sending history",
                        kind: "alert",
                        onSelect: () => {
                            showDeleteHistoryDialog({ initiateForcedRender, setUserDialog });
                            onClose();
                        },
                        icon: <TrashBinIcon />,
                    },
                ];

                const MenuList = options.map((props, index) =>
                    props.text === viewFullSendingLog ? (
                        <MenuOptionFullSendingLog key={index} view={view} onClose={onClose} />
                    ) : props.text === importSendingHistory ? (
                        <MenuOptionImport key={index} view={view} onClose={onClose} />
                    ) : (
                        <MenuOption key={index} view={view} {...props} />
                    )
                );
                return <div style={{ display: "flex", flexDirection: "column" }}>{MenuList}</div>;
            }}
        />
    );
}
export default SettingsMenu;
