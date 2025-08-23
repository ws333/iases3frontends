import styled from "styled-components";
import { DownloadIcon, InfoIcon, Menu, MenuOption, MenuOptionProps, OpenMenuButton, TrashBinIcon } from "ui-kit";
import { ProjectEnvProps } from "../types/types";
import { DOCS_URL_ADDON_DOCUMENTATION } from "../constants/constants";
import { DOCS_URL_WEBAPP_DOCUMENTATION } from "../constants/constantsDynamic";
import { exportFromLocalStorage } from "../helpers/exportFromLocalStorage";
import { showCountryCodesLegendDialog } from "../helpers/showCountryCodesLegendDialog";
import { showDeleteHistoryDialog } from "../helpers/showDeleteHistoryDialog";
import { useStoreState } from "../store/store";
import MenuOptionFullSendingLog from "./MenuOptionFullSendingLog";
import MenuOptionImport from "./MenuOptionImport";
import MenuOptionViewOnlineDocumentation from "./MenuOptionViewOnlineDocumentation";

const StyledTitle = styled.span`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.toCssValue()};
`;

type Props = Pick<ProjectEnvProps, "environment">;

function SettingsMenu({ environment }: Props) {
    const emailsSent = useStoreState((state) => state.contactList.emailsSent);

    const importSendingHistory = "Import sending history";
    const viewFullSendingLog = "View full sending log";
    const viewOnlineDocumentation = "View online documentation";

    const docsUrl = environment === "webapp" ? DOCS_URL_WEBAPP_DOCUMENTATION : DOCS_URL_ADDON_DOCUMENTATION;

    return (
        <Menu
            title={<StyledTitle>Settings</StyledTitle>}
            renderOpener={({ props: { ref, ...props } }) => <OpenMenuButton ref={ref} size="l" {...props} />}
            renderContent={({ view, onClose }) => {
                const options: MenuOptionProps[] = [
                    {
                        // Dummy to position menu option in MenuList below
                        text: viewOnlineDocumentation,
                        onSelect: () => {},
                    },
                    {
                        // Dummy to position menu option in MenuList below
                        text: viewFullSendingLog,
                        onSelect: () => {},
                    },
                    {
                        // Dummy to position menu option in MenuList below
                        text: importSendingHistory,
                        onSelect: () => {},
                    },
                    {
                        text: "Show country codes legend",
                        onSelect: () => {
                            showCountryCodesLegendDialog();
                            onClose();
                        },
                        icon: <InfoIcon />,
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
                        text: "Reset sending history",
                        kind: "alert",
                        onSelect: () => {
                            showDeleteHistoryDialog();
                            onClose();
                        },
                        icon: <TrashBinIcon />,
                    },
                ];

                const MenuList = options.map((props, index) =>
                    props.text === viewOnlineDocumentation ? (
                        <MenuOptionViewOnlineDocumentation
                            key={index}
                            view={view}
                            onClose={onClose}
                            docsUrl={docsUrl}
                        />
                    ) : props.text === viewFullSendingLog ? (
                        <MenuOptionFullSendingLog key={index} view={view} onClose={onClose} />
                    ) : props.text === importSendingHistory ? (
                        <MenuOptionImport key={index} view={view} onClose={onClose} />
                    ) : (
                        <MenuOption key={index} view={view} {...props} />
                    )
                );

                const optionEndActiveSession: MenuOptionProps = {
                    text: "Sending session in progress! Click the 'Stop' or 'End session' button to enable settings",
                    kind: "alert",
                    onSelect: onClose,
                    icon: <InfoIcon />,
                };

                return (
                    <div className="settings_menu">
                        {emailsSent ? <MenuOption key={1} view={view} {...optionEndActiveSession} /> : MenuList}
                    </div>
                );
            }}
        />
    );
}
export default SettingsMenu;
