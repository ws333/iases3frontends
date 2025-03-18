import { useEffect, useRef, useState } from "react";
import { UserDialog } from "../types/types";
import { ContactI3C } from "../types/typesI3C";
import TextEndingSession from "../components/dialogTexts/TextEndingSession";
import { fetchAndMergeContacts, fetchOnlineNations, saveLocalContacts } from "../helpers/contacts";

const maxCountOptions = [5, 50, 100, 200, 500, 1000];

type Props = {
    setUserDialog: React.Dispatch<React.SetStateAction<UserDialog>>;
};

function useContactList({ setUserDialog }: Props) {
    const [contacts, setContacts] = useState<ContactI3C[]>([]);
    const [emailsSent, setEmailsSent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [maxCount, _setMaxCount] = useState(maxCountOptions[1]);
    const [nationOptions, setNationOptions] = useState<string[]>([]);
    const [selectedNations, setSelectedNations] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    function setMaxCount(value: number) {
        if (value <= emailsSent) {
            setUserDialog({
                title: "Confirm ending sission...",
                message: TextEndingSession,
                onClose: () => {
                    console.log("onClose");
                    setUserDialog({ message: "" });
                },
                onConfirm: () => {
                    console.log("onConfirm");
                    _setMaxCount(value);
                    updateMaxSelectedContactsNotSent(value);
                    setUserDialog({ message: "" });
                },
            });
            return;
        }
        _setMaxCount(value);
        updateMaxSelectedContactsNotSent(value);
    }

    // Fetch nations and contacts on first render
    useEffect(() => {
        const controller = new AbortController();
        const loadContacts = async () => {
            try {
                const _nations = await fetchOnlineNations(controller.signal);
                setNationOptions(_nations);
                const merged = await fetchAndMergeContacts(controller.signal);
                setContacts(merged);
                saveLocalContacts(merged);
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    console.warn("*Debug* -> EmailSender.tsx -> useEffect fetch error:", error.message);
                }
            }
        };
        void loadContacts();

        return () => {
            controller.abort();
        };
    }, []);

    const selectedContacts = contacts.filter((contact) => selectedNations.includes(contact.nation));

    const initialNations = nationOptions.reduce<Record<string, number>>((acc, nation) => ({ ...acc, [nation]: 0 }), {});

    const mostRecentUidsSentPerNation = selectedContacts.reduce<Record<string, number>>(
        (acc, contact) =>
            contact.uid > acc[contact.nation] && contact.sentDate
                ? { ...acc, [contact.nation]: contact.uid }
                : { ...acc, [contact.nation]: acc[contact.nation] },
        initialNations
    );

    const selectedContactsNotSent = selectedContacts.filter(
        (contact) => !contact.sentDate && contact.uid > mostRecentUidsSentPerNation[contact.nation]
    );

    function getMaxSelectedContactsNotSent() {
        return Math.min(selectedContactsNotSent.length, maxCount);
    }

    function updateMaxSelectedContactsNotSent(newMaxCount?: number) {
        maxSelectedContactsNotSent.current = newMaxCount ? newMaxCount : getMaxSelectedContactsNotSent();
    }

    const maxSelectedContactsNotSent = useRef(getMaxSelectedContactsNotSent());

    const nextContactNotSent = selectedContactsNotSent[0] || {
        name: "",
        email: "",
    };

    return {
        contacts,
        setContacts,
        emailsSent,
        isLoading,
        setEmailsSent,
        maxCount,
        maxCountOptions,
        maxSelectedContactsNotSent,
        mostRecentUidsSentPerNation,
        updateMaxSelectedContactsNotSent,
        selectedContacts,
        selectedContactsNotSent,
        nextContactNotSent,
        setMaxCount,
        nationOptions,
        setNationOptions,
        selectedNations,
        setSelectedNations,
        selectAll,
        setSelectAll,
    };
}

export { useContactList };
export type UseContactListReturnType = ReturnType<typeof useContactList>;
