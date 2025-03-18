import { useEffect, useRef, useState } from "react";
import { UserDialog } from "../types/types";
import { ContactI3C } from "../types/typesI3C";
import TextEndingSession from "../components/dialogTexts/TextEndingSession";
import { fetchAndMergeContacts, fetchOnlineNations, saveLocalContacts } from "../helpers/contacts";

const maxCountOptions = [5, 50, 100, 200, 500, 1000];

const oneHour = 1000 * 60 * 60;
const oneDay = oneHour * 24;
const sevenDays = oneDay * 7;
const oneMonth = sevenDays * 30;
const threeMonths = oneMonth * 3;

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

    const now = Date.now();
    const oneHourAgo = now - oneHour;
    const oneDayAgo = now - oneDay;
    const sevenDaysAgo = now - sevenDays;
    const oneMonthAgo = now - oneMonth;
    const threeMonthsAgo = now - threeMonths;

    const selectedContactsNotSent = selectedContacts.filter((contact) => contact.sentDate < threeMonthsAgo);

    const totalSentCount = contacts.reduce((acc, contact) => acc + contact.sentCount, 0);
    const totalSentCountLastHour = contacts.reduce(
        (acc, contact) => (contact.sentDate > oneHourAgo ? acc + 1 : acc),
        0
    );
    const totalSentCount24Hours = contacts.reduce((acc, contact) => (contact.sentDate > oneDayAgo ? acc + 1 : acc), 0);
    const totalSentCountLast7Days = contacts.reduce(
        (acc, contact) => (contact.sentDate > sevenDaysAgo ? acc + 1 : acc),
        0
    );
    const totalSentCountLast30Days = contacts.reduce(
        (acc, contact) => (contact.sentDate > oneMonthAgo ? acc + 1 : acc),
        0
    );
    const totalSentCountLast3Months = contacts.reduce(
        (acc, contact) => (contact.sentDate > threeMonthsAgo ? acc + 1 : acc),
        0
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
        totalSentCount,
        totalSentCountLastHour,
        totalSentCount24Hours,
        totalSentCountLast7Days,
        totalSentCountLast30Days,
        totalSentCountLast3Months,
    };
}

export { useContactList };
export type UseContactListReturnType = ReturnType<typeof useContactList>;
