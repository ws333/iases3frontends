import { UseContactListReturnType } from "../hooks/useContactList";

type SendingProgressProps = {
    useCL: UseContactListReturnType;
};

function SendingProgress({ useCL }: SendingProgressProps) {
    return (
        <section className="section_sending_progress">
            <h2>Progress</h2>
            <progress
                className="progress_bar"
                value={useCL.emailsSent}
                max={Math.min(useCL.selectedContacts.length, useCL.maxCount)}
            ></progress>
            <p>
                {useCL.emailsSent} / {useCL.maxSelectedContactsNotSent.current}
            </p>
        </section>
    );
}

export default SendingProgress;
