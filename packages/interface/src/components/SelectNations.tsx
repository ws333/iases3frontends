import { UseContactListReturnType } from "../hooks/useContactList";
import "./SelectNations.css";

type SelectNationsProps = {
    useCL: UseContactListReturnType;
    isSending: boolean;
};

function SelectNations({ useCL, isSending }: SelectNationsProps) {
    const onChangeSelectAll = () => {
        useCL.toggleIsSelectedAllNations();
    };

    const onChangeNation = (checked: boolean, nation: string) => {
        useCL.setSelectedNations({ checked, nation });
    };

    return (
        <div className="select-nations">
            {!useCL.isLoading && (
                <div className="nation-options">
                    <div className="title-container">
                        <label className="title">Available contacts</label>
                    </div>
                    <div className={`nation-list ${isSending ? "disabled" : ""}`}>
                        <label className="nation-item">
                            <input
                                type="checkbox"
                                disabled={isSending}
                                checked={useCL.isSelectedAllNations}
                                onChange={onChangeSelectAll}
                            />
                            Select All
                        </label>
                    </div>
                    <div className={`nation-list ${isSending ? "disabled" : ""}`}>
                        {useCL.nationOptions.map((nation) => (
                            <label key={nation} className="nation-item">
                                <input
                                    type="checkbox"
                                    disabled={isSending}
                                    onChange={(e) => onChangeNation(e.target.checked, nation)}
                                    checked={useCL.selectedNations.includes(nation)}
                                />
                                {nation}
                            </label>
                        ))}
                    </div>
                </div>
            )}
            <div className="selected-info">
                <div>Selected contacts {useCL.selectedContacts.length}</div>
                <div>Selected not sent {useCL.selectedContactsNotSent.length}</div>
            </div>
            <div className="container_sent_counts">
                <div className="column_left_sent_counts">
                    <div>Total sent count</div>
                    <div>Last hour</div>
                    <div>24 hours</div>
                    <div>7 days</div>
                    <div>30 days</div>
                    <div>3 months</div>
                </div>
                <div className="column_right_sent_counts">
                    <div>{useCL.totalSentCount}</div>
                    <div>{useCL.totalSentCountLastHour}</div>
                    <div>{useCL.totalSentCount24Hours}</div>
                    <div>{useCL.totalSentCountLast7Days}</div>
                    <div>{useCL.totalSentCountLast30Days}</div>
                    <div>{useCL.totalSentCountLast3Months}</div>
                </div>
            </div>
        </div>
    );
}

export default SelectNations;
