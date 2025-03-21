import { UseContactListReturnType } from "../hooks/useContactList";

type SendingProgressProps = {
    useCL: UseContactListReturnType;
};

function SendingProgress({ useCL }: SendingProgressProps) {
    const max =
        useCL.maxSelectedContactsNotSent === 0
            ? useCL.emailsSent
            : useCL.emailsSent === 0
              ? useCL.maxSelectedContactsNotSent
              : useCL.maxSelectedContactsNotSent < useCL.maxCount
                ? useCL.selectedContactsNotSent.length + useCL.emailsSent
                : useCL.maxCount;

    return (
        <section className="section_sending_progress">
            <h2>Progress</h2>
            <progress className="progress_bar" value={useCL.emailsSent} max={max}></progress>
            <p>
                {useCL.emailsSent} / {max}
            </p>
        </section>
    );
}

export default SendingProgress;
