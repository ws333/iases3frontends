import { BookIcon, MenuOption, MenuView } from "ui-kit";
import { showDocumentationDialog } from "../helpers/showDocumentationDialog";
import { useStoreActions } from "../store/store";

type Props = {
    view: MenuView;
    onClose: () => void;
    docsUrl: string;
};

const MenuOptionViewOnlineDocumentation = ({ view, onClose }: Props) => {
    const setUserDialog = useStoreActions((actions) => actions.userDialog.setUserDialog);

    const onSelectMenuOption = () => {
        showDocumentationDialog({ setUserDialog });
        onClose();
    };

    return (
        <div>
            <MenuOption view={view} text={"View documentation"} onSelect={onSelectMenuOption} icon={<BookIcon />} />
        </div>
    );
};

export default MenuOptionViewOnlineDocumentation;
