import { useEffect, useState } from 'react';
import { Tooltip } from 'ui-kit';
import { maxCountOptions, minSendingDelay } from '../constants/constants';
import { LanguageOption } from '../constants/faxTemplates';
import { storeOptionsKey } from '../helpers/indexedDB';
import { useStoreActions, useStoreState } from '../store/store';
import './FaxOptions.css';

export type FaxOptionsProps = {
  isSending: boolean;
};

function FaxOptions({ isSending }: FaxOptionsProps) {
  const delay = useStoreState((state) => state.faxOptions.delay);
  const setDelay = useStoreActions((actions) => actions.faxOptions.setDelay);

  const language = useStoreState((state) => state.faxOptions.language);
  const setLanguage = useStoreActions((actions) => actions.faxOptions.setLanguage);
  const languageOptions = useStoreState((state) => state.faxOptions.languageOptions);

  const maxCount = useStoreState((state) => state.faxOptions.maxCount);
  const setMaxCount = useStoreActions((actions) => actions.faxOptions.setMaxCount);

  // Update local delay after hydration
  useEffect(() => {
    setLocalDelay(delay.toString());
  }, [delay]);

  // Using local state to allow empty input
  const [localDelay, setLocalDelay] = useState(delay.toString());

  function processDelayInput(value: string) {
    const delay = Number(value);
    return delay > minSendingDelay ? delay : minSendingDelay;
  }

  return (
    <div className="fax-options">
      <div>
        <Tooltip
          placement="top"
          renderOpener={(props) => (
            <label {...props}>
              Delay in seconds between faxes sent
              <br />
              <div className="container-delay">
                <div>
                  <input
                    id="delay_input"
                    type="number"
                    value={localDelay}
                    disabled={isSending}
                    min={minSendingDelay.toString()}
                    onChange={(e) => {
                      const { value } = e.target;
                      setLocalDelay(value);
                      void storeOptionsKey(processDelayInput(value), 'delay');
                    }}
                    onBlur={(e) => {
                      const delay = processDelayInput(e.target.value);
                      setLocalDelay(delay.toString());
                      setDelay(delay);
                    }}
                  />
                </div>
              </div>
            </label>
          )}
          content={
            <span className="tooltip-min-sending-delay">
              {minSendingDelay} is the minimum to avoid rate limits, increase if hitting the rate limit for your fax
              provider.
            </span>
          }
        />
      </div>

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
