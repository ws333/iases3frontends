import { MenuView } from "radzionkit";
import { RefreshIcon } from "radzionkit/ui/icons/RefreshIcon";
import { ChangeEvent, useRef, useState } from "react";
import { ImportStats } from "../types/types";
import { useStoreActions } from "../hooks/storeHooks";
import { importToLocalStorage } from "../helpers/importToLocalStorage";
import { MenuOption } from "./customRadzionkit/MenuOption";

type Props = {
    key: React.Key;
    view: MenuView;
};

const ImportMenuOption = ({ key, view }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);
    const [importStats, setImportStats] = useState<ImportStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const initiateForcedRender = useStoreActions((actions) => actions.contactList.initiateForcedRender);

    const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setImportStats(null);
        setError(null);

        try {
            const importStats = await importToLocalStorage(file);
            setImportStats(importStats);
            initiateForcedRender();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error during import");
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const onSelectMenuOption = () => {
        if (!importing) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} accept=".zip" onChange={handleImport} style={{ display: "none" }} />
            <div>
                <MenuOption
                    key={key}
                    view={view}
                    text={importing ? "Importing..." : "Import sending history"}
                    onSelect={onSelectMenuOption}
                    icon={<RefreshIcon />}
                />
            </div>

            {importStats && (
                <div
                    style={{
                        marginRight: "0.5rem",
                        marginLeft: "24px",
                        backgroundColor: "#333",
                        padding: "0.8rem",
                        border: "1px solid #fff1",
                        borderRadius: "5px",
                    }}
                >
                    <p style={{ marginTop: "0" }}>Import complete!</p>
                    <ul style={{ paddingLeft: "1.5rem", marginTop: "0.25rem" }}>
                        <li>Contacts processed: {importStats.contactsProcessed}</li>
                        <li>Contacts deleted: {importStats.contactsDeleted}</li>
                        <li>Log entries processed: {importStats.logsProcessed}</li>
                    </ul>
                </div>
            )}

            {error && <div style={{ color: "red", marginLeft: "1rem", marginTop: "0.5rem" }}>Error: {error}</div>}
        </div>
    );
};

export default ImportMenuOption;
