import React, { useEffect, useRef, useState } from 'react';
import type { Fax } from '../types/types';
import { ContactI3CFax } from '../types/typesI3C';
import { defaultRandomWindow, fullProgressBarDelay } from '../../../addon/packages/interface/src/constants/constants';
import Dialog from '../../../addon/packages/interface/src/components/Dialog';
import ErrorMessage from '../../../addon/packages/interface/src/components/ErrorMessage';
import Header from '../../../addon/packages/interface/src/components/Header';
import Message from '../../../addon/packages/interface/src/components/Message';
import { useContactListFax } from '../hooks/useContactListFax';
import { useFaxOptions } from '../hooks/useFaxOptions';
import { useUpdateSendingStats } from '../hooks/useUpdateSendingStats';
import { waitRandomSeconds } from '../../../addon/packages/interface/src/helpers/waitRandomSeconds';
import { getSessionFinishedText } from '../helpers/getSessionFinishedText';
import { storeActiveContacts } from '../helpers/indexedDB';
import { renderFaxPdf } from '../helpers/renderFaxPdf';
import { sendFax } from '../helpers/sendFax';
import { checkForDangelingSession, clearSessionState, updateSessionState } from '../helpers/sessionState';
import { useStoreActions, useStoreState } from '../store/store';
import ButtonEndSession from './ButtonEndSession';
import ButtonSendFaxes from './ButtonSendFaxes';
import ButtonStopSending from './ButtonStopSending';
import FaxOptions from './FaxOptions';
import FaxPreview from './FaxPreview';
import SelectNations from './SelectNations';
import SendingLog from './SendingLog';
import SendingProgress from './SendingProgress';
import './FaxSender.css';

function FaxSender() {
  const setMessage = useStoreActions((actions) => actions.userMessage.setMessage);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSending, setIsSending] = useState(false);

  const userDialog = useStoreState((state) => state.userDialog);

  const addLogItem = useStoreActions((state) => state.sendingLog.addLogItem);

  const controller = useRef(new AbortController());

  useUpdateSendingStats(isSending);

  const {
    faxesSent,
    endSession,
    maxCount,
    maxSelectedContactsNotSent,
    nextContactNotSent,
    selectedContactsNotSent,
    selectedNations,
    setFaxesSent,
    setEndSession,
    setContact,
  } = useContactListFax();

  const { delay, FaxComponent } = useFaxOptions();

  useEffect(() => {
    void checkForDangelingSession();
  }, []);

  const leftToSendCount = useRef(0);
  const remainingCountSession = Math.max(0, maxCount - faxesSent);
  leftToSendCount.current = selectedContactsNotSent.slice(0, remainingCountSession).length;

  const checkInProgress = useRef(false);
  const selectedNationsAtSendTime = useRef<string[]>([]);
  const selectedNationsChangedSinceLastSending = selectedNationsAtSendTime.current !== selectedNations;
  useEffect(() => {
    async function checkIfSessionFinished() {
      if (
        faxesSent > 0 &&
        !checkInProgress.current &&
        (endSession || (leftToSendCount.current === 0 && !selectedNationsChangedSinceLastSending))
      ) {
        checkInProgress.current = true;
        await waitRandomSeconds(fullProgressBarDelay, 0); // Let progressbar stay at 100% for a few seconds
        const message = getSessionFinishedText(faxesSent);
        setMessage(message);
        addLogItem({ message, addNewline: true });
        clearSessionState();
        checkInProgress.current = false;
        setFaxesSent(0);
        setEndSession(false);
        const messageReady = `${message} Ready to start new session!`;
        setMessage(messageReady);
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

  async function onClickSendFax(e: React.MouseEvent) {
    e.preventDefault();

    setIsSending(true);
    setErrorMessage('');
    setMessage('Sending faxes, please wait...');
    await waitRandomSeconds(fullProgressBarDelay / 2, 0);

    const contactsToSendTo = selectedContactsNotSent.slice(0, maxCount - faxesSent);

    selectedNationsAtSendTime.current = selectedNations;

    for (const contact of contactsToSendTo) {
      const logContact = `${contact.n} - ${contact.f}`;

      try {
        if (controller.current.signal.aborted) {
          // User stopped the session or sending of fax to current contact failed, so breaking out of loop
          controller.current = new AbortController();
          await waitRandomSeconds(fullProgressBarDelay / 2, 0);
          break;
        }

        await prepareAndSendFax(contact);

        // Don't count and log fax as sent when signal has been aborted, e.g. if backend is down.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (controller.current.signal.aborted) {
          await waitRandomSeconds(fullProgressBarDelay / 2, 0);
          controller.current = new AbortController();
          setIsSending(false);
          break;
        }

        const _delay = leftToSendCount.current > 1 ? delay : fullProgressBarDelay;
        const randomWindow = leftToSendCount.current > 1 ? defaultRandomWindow : 0;

        // State faxesSent needs to be updated before setContact (to awoid flickering of progressbar max) and waitRandomSeconds
        setFaxesSent((count) => {
          const newCount = ++count;
          updateSessionState(newCount, _delay);
          return newCount;
        });

        contact.sd = Date.now();
        contact.sc++;
        setContact(contact); // Update the contact in state
        await storeActiveContacts(contact); // Update the contact in indexedDB
        addLogItem({ message: `Fax sent to ${logContact}` });

        await waitRandomSeconds(_delay, randomWindow, { signal: controller.current.signal });
      } catch (error) {
        console.warn('Error in onClickSendFax:', (error as Error).message);
        addLogItem({ message: `Failed to send fax to ${logContact}` });
      }
    }

    setIsSending(false);
  }

  const prepareAndSendFax = async (contact: ContactI3CFax) => {
    const faxPdf = await renderFaxPdf(contact.n);
    const fax: Fax = {
      number: contact.f,
      pdf: faxPdf,
    };

    const status = await sendFax(fax);
    if (status.message) setMessage(status.message);
    if (status.error) controller.current.abort();
  };

  const onClickEndSession = () => {
    setEndSession(true);
    setMessage('Session ended by user...');
  };

  const onClickStop = () => {
    controller.current.abort();
    setMessage('Sending stopped by user...');
  };

  const isBusy = isSending || endSession || controller.current.signal.aborted || checkInProgress.current;

  const showErrorMessage = errorMessage && !isBusy;

  const sendButtonDisabled = isBusy || !selectedContactsNotSent.length;

  const stopButtonDisabled =
    leftToSendCount.current === 0 || faxesSent === 0 || controller.current.signal.aborted || checkInProgress.current;

  return (
    <div className="container_fax_sender">
      <Header />
      <br />

      {userDialog.isOpen && (
        <Dialog
          title={userDialog.title}
          message={userDialog.message}
          confirmActionText={userDialog.confirmActionText}
          isOpen={userDialog.isOpen}
          onClose={userDialog.onClose}
          onConfirm={userDialog.onConfirm}
          showConfirmationModal={userDialog.showConfirmationModal}
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
        {<Message />}

        <div className="container_buttons">
          {!isSending && (
            <div className="container_buttons_not_issending">
              {faxesSent > 0 && !endSession && !checkInProgress.current && (
                <ButtonEndSession onClick={onClickEndSession} />
              )}
              <ButtonSendFaxes
                checkInProgress={checkInProgress.current}
                disabled={sendButtonDisabled}
                endSession={endSession}
                leftToSendCount={leftToSendCount.current}
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
              toSendCount={leftToSendCount.current}
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
