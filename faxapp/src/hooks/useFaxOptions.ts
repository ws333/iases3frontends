import { useEffect } from 'react';
import { defaultMaxCount, defaultSendingDelay } from '../constants/constants';
import { LanguageOption, defaultLanguage } from '../constants/faxTemplates';
import { OPTIONS_KEY, getOptions } from '../helpers/indexedDB';
import { useStoreActions, useStoreState } from '../store/store';

function useFaxOptions() {
  const FaxComponent = useStoreState((state) => state.faxOptions.FaxComponent);
  const delay = useStoreState((state) => state.faxOptions.delay);
  const setDelay = useStoreActions((actions) => actions.faxOptions.setDelay);
  const setLanguage = useStoreActions((actions) => actions.faxOptions.setLanguage);
  const setMaxCount = useStoreActions((actions) => actions.faxOptions.setMaxCount);

  useEffect(() => {
    const hydrateOptions = async () => {
      const options = await getOptions();
      if (options.keys.length) {
        const delay = (options.find((item) => item.key === OPTIONS_KEY.DELAY)?.value ?? defaultSendingDelay) as number;
        setDelay(delay);

        const _maxCount = (options.find((item) => item.key === OPTIONS_KEY.MAX_COUNT)?.value ??
          defaultMaxCount) as number;
        setMaxCount(_maxCount);

        const language = (options.find((item) => item.key === OPTIONS_KEY.LANGUAGE)?.value ??
          defaultLanguage) as LanguageOption;

        setLanguage({ language });
      }
    };
    void hydrateOptions();
  }, [setDelay, setLanguage, setMaxCount]);

  return {
    delay,
    FaxComponent,
  };
}
export { useFaxOptions };
