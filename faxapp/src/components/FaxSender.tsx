import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FaxStatuses } from '../types/types';
import { ContactI3CFax } from '../types/typesI3C';
import { WebSocketMessage } from '../types/typesSharedFax';
import { defaultRandomWindow, fullProgressBarDelay } from '../../../addon/packages/interface/src/constants/constants';
import { ERROR_RESTART_BROWSER, maxFaxesInQueueCount } from '../constants/constants';
import ErrorMessage from '../../../addon/packages/interface/src/components/ErrorMessage';
import Header from '../../../addon/packages/interface/src/components/Header';
import Message from '../../../addon/packages/interface/src/components/Message';
import { useContactListFax } from '../hooks/useContactListFax';
import { useFaxOptions } from '../hooks/useFaxOptions';
import { useUpdateSendingStats } from '../hooks/useUpdateSendingStats';
import { useWebSocket } from '../hooks/useWebSocket';
import { waitRandomSeconds } from '../../../addon/packages/interface/src/helpers/waitRandomSeconds';
import { checkApiKeyExists } from '../helpers/crypto';
import { formatFaxNumber, formatName } from '../helpers/formatRecipientInfo';
import { getContactNameAndNumber } from '../helpers/getContactNameAndNumber';
import { getSessionFinishedText } from '../helpers/getSessionFinishedText';
import { checkForDangelingSession, clearSessionState } from '../helpers/sessionState';
import { showRegisterFaxApiKey } from '../helpers/showRegisterFaxApiKey';
import { showSupplyPassphraseDialog } from '../helpers/showSupplyPassphraseDialog';
import { store, useStoreActions, useStoreState } from '../store/store';
import { toastOptions } from '../styles/styles';
import ButtonEndSession from './ButtonEndSession';
import ButtonSendFaxes from './ButtonSendFaxes';
import ButtonStopSending from './ButtonStopSending';
import Dialog from './Dialog';
import FaxOptions from './FaxOptions';
import FaxPreview from './FaxPreview';
import FaxStatusList from './FaxStatusList';
import SelectNations from './SelectNations';
import SendingLog from './SendingLog';
import SendingProgress from './SendingProgress';
import './FaxSender.css';

function FaxSender() {
  const message = useStoreState((state) => state.userMessage.message);
  const setMessage = useStoreActions((actions) => actions.userMessage.setMessage);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSending, setIsSending] = useState(false);

  const [faxStatuses, setFaxStatuses] = useState<FaxStatuses>(new Map());

  const fullPageOverlay = useStoreState((state) => state.fullPageOverlay);
  const userDialog = useStoreState((state) => state.userDialog);
  const apiKey = useStoreState((state) => state.faxOptions.apiKey);

  const addLogItem = useStoreActions((state) => state.sendingLog.addLogItem);

  const controller = useRef(new AbortController());

  useUpdateSendingStats(isSending);

  const {
    faxesInQueue,
    bumpFaxesInQueue,
    faxesSent,
    endSession,
    maxCount,
    maxSelectedContactsNotSent,
    nextContactNotSent,
    selectedContactsNotSent,
    selectedNations,
    setFaxesSent,
    setEndSession,
  } = useContactListFax();

  const { delay, FaxComponent } = useFaxOptions();

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (message.type === 'webhook_data') {
      const { webhookData } = message;
      const event = webhookData.event_type?.slice(4).replace('.', ' ');
      const faxId = webhookData.payload?.fax_id ?? '';
      const duration = webhookData.payload?.call_duration_secs;
      const timestamp =
        webhookData.event_type === 'fax.delivered' || webhookData.event_type === 'fax.failed' ? Date.now() : 0;

      const nameAndNumber = getContactNameAndNumber(webhookData.payload?.to);
      const value = `Fax to ${nameAndNumber} ${event} ${duration ? `in ${duration}s` : ''}`;

      if (faxId) setFaxStatuses((prev) => new Map(prev.set(faxId, { timestamp, value })));
    }
  }, []);

  const { sendFax } = useWebSocket({ apiKey, onMessage: handleWebSocketMessage });

  useEffect(() => {
    void checkForDangelingSession();
  }, []);

  useEffect(() => {
    void checkApiKeyExists().then((exists) =>
      !exists ? showRegisterFaxApiKey() : !apiKey ? showSupplyPassphraseDialog() : null,
    );
  }, [apiKey]);

  const faxedAddedToQueue = useRef(0);
  const faxesLeftToQueue = maxCount - faxedAddedToQueue.current;

  useEffect(() => {
    if (isSending && faxesLeftToQueue === 0) {
      setMessage('Queuing is complete, waiting for the fax service provider to process the faxes...');
    }
  }, [isSending, faxesLeftToQueue, setMessage]);

  const faxesLeftToSend = useRef(0);
  const remainingCountSession = Math.max(0, maxCount - faxesSent);
  faxesLeftToSend.current = selectedContactsNotSent.slice(0, remainingCountSession).length;

  const checkInProgress = useRef(false);
  const selectedNationsAtSendTime = useRef<string[]>([]);
  const selectedNationsChangedSinceLastSending = selectedNationsAtSendTime.current !== selectedNations;

  useEffect(() => {
    if (isSending && remainingCountSession === 0) setIsSending(false);
  }, [isSending, remainingCountSession]);

  useEffect(() => {
    async function checkIfSessionFinished() {
      if (
        faxesSent > 0 &&
        !checkInProgress.current &&
        (endSession || (faxesLeftToSend.current === 0 && !selectedNationsChangedSinceLastSending))
      ) {
        checkInProgress.current = true;
        await waitRandomSeconds(fullProgressBarDelay, 0); // Let progressbar stay at 100% for a few seconds
        const message = getSessionFinishedText(faxesSent);
        setMessage(message);
        addLogItem({ message });
        clearSessionState();
        checkInProgress.current = false;
        setFaxesSent(0);
        setEndSession(false);
        const messageReady = `${message} Ready to start new session!`;
        setMessage(messageReady);
        faxedAddedToQueue.current = 0;
      }
    }
    void checkIfSessionFinished();
  }, [
    faxesSent,
    endSession,
    setFaxesSent,
    setEndSession,
    selectedNationsChangedSinceLastSending,
    addLogItem,
    setMessage,
  ]);

  // Clean up faxIds that were sucessfully delivered more than 10 secs ago
  useEffect(() => {
    const interval = setInterval(() => {
      setFaxStatuses((prev) => {
        const now = Date.now();
        const newMap = new Map();
        for (const [key, status] of prev) {
          if (status.timestamp === 0 || now - status.timestamp <= 10000) {
            newMap.set(key, status);
          }
        }
        return newMap;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  async function pauseSending() {
    await waitRandomSeconds(fullProgressBarDelay / 2, 0);
    controller.current = new AbortController();
    setIsSending(false);
  }

  async function onClickSendFax(e: React.MouseEvent) {
    e.preventDefault();

    setIsSending(true);
    setErrorMessage('');
    setMessage('Queing faxes, please wait...');
    await waitRandomSeconds(fullProgressBarDelay / 2, 0);

    const contactsToSendTo = selectedContactsNotSent.slice(0, maxCount - faxesSent);

    selectedNationsAtSendTime.current = selectedNations;

    for (const contact of contactsToSendTo) {
      const logContact = `${contact.n} ${formatFaxNumber(contact.f)}`;

      try {
        // Pause the session if the user clicked the stop button
        if (controller.current.signal.aborted) {
          await pauseSending();
          break;
        }

        const result = await prepareAndSendFax(contact);

        if (result.type === 'send_fax_error') {
          toast(result.message, { ...toastOptions });
          setMessage(result.message);
        }

        // Stop sending if backend didn't acknowledge receiving the send fax request
        if (result.type !== 'send_fax_receipt') {
          await pauseSending();
          break;
        }

        const _delay = faxesLeftToSend.current > 1 ? delay : fullProgressBarDelay;
        const randomWindow = faxesLeftToSend.current > 1 ? defaultRandomWindow : 0;

        // Counts number of faxes currently in queue
        // Decremented when faxes are successfully delivered
        bumpFaxesInQueue();

        // Counts total number of faxes added to queue for current session
        faxedAddedToQueue.current += 1;

        addLogItem({ message: `Fax to ${logContact} queued` });

        while (store.getState().contactList.faxesInQueue >= maxFaxesInQueueCount) {
          await waitRandomSeconds(delay, randomWindow, { signal: controller.current.signal });
        }

        await waitRandomSeconds(_delay, randomWindow, { signal: controller.current.signal });
      } catch (error) {
        controller.current.abort();
        setMessage(ERROR_RESTART_BROWSER);
        setIsSending(false);
        addLogItem({ message: `Failed to queue fax to ${logContact}` });
        console.warn('Error in onClickSendFax:', (error as Error).message);
        break;
      }
    }
  }

  async function prepareAndSendFax(contact: ContactI3CFax) {
    const sendFaxMessage: WebSocketMessage = {
      type: 'send_fax',
      apiKey,
      faxHeader: {
        toName: formatName(contact.n),
        toNumber: formatFaxNumber(contact.f),
      },
    };

    return await sendFax(sendFaxMessage);
  }

  const onClickEndSession = () => {
    setEndSession(true);
    setMessage('Session ended by user...');
  };

  const onClickStop = () => {
    controller.current.abort();
    setIsSending(false);
    setMessage(
      'Queuing stopped, waiting for already queued faxes to be processed by fax service provider (about 1 minute).',
    );
  };

  // Update user message after user clicked stop button and all queued faxes have been processed by fax service provider
  useEffect(() => {
    if (!isSending && !checkInProgress.current && !faxesInQueue && faxesSent > 0) {
      setMessage('Queuing stopped by user...');
    }
  }, [faxesInQueue, faxesSent, isSending, setMessage]);

  const isBusy = isSending || endSession || controller.current.signal.aborted || checkInProgress.current;

  const showErrorMessage = errorMessage && !isBusy;

  const sendButtonDisabled = isBusy || !selectedContactsNotSent.length || faxesInQueue > 0;

  const stopButtonDisabled =
    !faxesLeftToQueue || !faxesInQueue || controller.current.signal.aborted || checkInProgress.current;

  return (
    <div className="container_fax_sender">
      <Header />

      {fullPageOverlay.isOpen && fullPageOverlay.content}

      {faxStatuses.size > 0 && <FaxStatusList statuses={faxStatuses} />}

      {userDialog.isOpen && (
        <Dialog
          title={userDialog.title}
          message={userDialog.message}
          confirmActionText={userDialog.confirmActionText}
          isOpen={userDialog.isOpen}
          onClose={userDialog.onClose}
          onConfirm={userDialog.onConfirm}
          showConfirmationModal={userDialog.showConfirmationModal}
          confirmActionKind={userDialog.confirmActionKind}
          showConfirm={userDialog.showConfirm}
          showCancel={userDialog.showCancel}
          width={userDialog.width}
          maxWidth={userDialog.maxWidth}
        />
      )}

      <div className="container_options_and_preview">
        <div className="container_options">
          <div className="column_options_left">
            <SelectNations selectedContactsNotSent={selectedContactsNotSent} isSending={isSending} />
          </div>
          <br />

          <div className="column_options_right">
            <FaxOptions isSending={isSending} />
          </div>
          <br />
        </div>

        {showErrorMessage && <ErrorMessage errorMessage={errorMessage} />}
        {<Message message={message} />}

        <div className="container_buttons">
          {!isSending && (
            <div className="container_buttons_not_issending">
              {faxesSent > 0 && !endSession && !checkInProgress.current && !faxesInQueue && (
                <ButtonEndSession onClick={onClickEndSession} />
              )}
              <ButtonSendFaxes
                checkInProgress={checkInProgress.current}
                disabled={sendButtonDisabled}
                endSession={endSession}
                leftToSendCount={faxesLeftToSend.current}
                onClick={(e) => {
                  void onClickSendFax(e);
                }}
              />
            </div>
          )}

          {isSending && (
            <ButtonStopSending
              aborted={controller.current.signal.aborted}
              checkInProgress={checkInProgress.current}
              disabled={stopButtonDisabled}
              onClick={onClickStop}
              leftToQueueCount={faxesLeftToQueue}
            />
          )}
        </div>

        <SendingProgress
          maxSelectedContactsNotSent={maxSelectedContactsNotSent}
          selectedContactsNotSent={selectedContactsNotSent}
        />

        <div className="container_fax_preview">
          <FaxPreview Component={FaxComponent} name={nextContactNotSent.n} />
        </div>
      </div>

      <SendingLog />
    </div>
  );
}

export default FaxSender;
