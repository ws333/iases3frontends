import { ContactI3CFax } from '../types/typesI3C';
import { useStoreState } from '../store/store';

type Props = {
  maxSelectedContactsNotSent: number;
  selectedContactsNotSent: ContactI3CFax[];
};

function SendingProgress({ maxSelectedContactsNotSent, selectedContactsNotSent }: Props) {
  const faxesSent = useStoreState((state) => state.contactList.faxesSent);
  const maxCount = useStoreState((state) => state.faxOptions.maxCount);

  const max =
    maxSelectedContactsNotSent === 0
      ? faxesSent
      : faxesSent === 0
        ? maxSelectedContactsNotSent
        : maxSelectedContactsNotSent < maxCount
          ? selectedContactsNotSent.length + faxesSent
          : maxCount;

  return (
    <section className="section_sending_progress">
      <h2>Sending progress</h2>
      <progress className="progress_bar" value={faxesSent} max={max}></progress>
      <p>
        {faxesSent} / {max}
      </p>
    </section>
  );
}

export default SendingProgress;
