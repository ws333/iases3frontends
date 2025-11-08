import { maxCountOptions } from '../constants/constants';
import { LanguageOption } from '../constants/faxTemplates';
import { useStoreActions, useStoreState } from '../store/store';
import './FaxOptions.css';

export type FaxOptionsProps = {
  isSending: boolean;
};

function FaxOptions({ isSending }: FaxOptionsProps) {
  const language = useStoreState((state) => state.faxOptions.language);
  const setLanguage = useStoreActions((actions) => actions.faxOptions.setLanguage);
  const languageOptions = useStoreState((state) => state.faxOptions.languageOptions);

  const maxCount = useStoreState((state) => state.faxOptions.maxCount);
  const setMaxCount = useStoreActions((actions) => actions.faxOptions.setMaxCount);

  return (
    <div className="fax-options">
      <div>
        <label>
          Number of faxes to send in this session
          <br />
          <select value={maxCount} disabled={isSending} onChange={(e) => setMaxCount(Number(e.target.value))}>
            {maxCountOptions.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Fax language
        <br />
        <select
          value={language}
          disabled={isSending}
          onChange={(e) => setLanguage({ language: e.target.value as LanguageOption })}
        >
          {languageOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FaxOptions;
