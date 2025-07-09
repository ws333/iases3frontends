import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import React, { useState } from 'react';
import { ContactI3C } from '../types/types';
import { SINGLE_CONTACT_MODE, URL_SEND_EMAIL, __DEV__ } from '../constants/constants';
import { emailTemplates } from '../constants/emailTemplates';
import { useContactList } from '../hooks/useContactList';
import { useEmailOptions } from '../hooks/useEmailOptions';
import { useSingleContact } from '../hooks/useSingleContact';
import { saveLocalContacts } from '../helpers/contacts';
import { fetchSendEmail } from '../helpers/fetchSendEmail';
import { removeLocalStorageItem } from '../helpers/localStorageHelpers';
import { mergeTemplate } from '../helpers/mergeTemplate';
import { validateEmail } from '../helpers/validateEmail';
import { waitRandomSeconds } from '../helpers/waitRandomSeconds';
import { loginRequest } from '../auth/authConfig';
import EmailOptions from './EmailOptions';
import EmailPreview from './EmailPreview';
import EmailsSentLog from './EmailsSentLog';
import Header from './Header';
import LogIn from './LogIn';
import LogOut from './LogOut';
import SelectNations from './SelectNations';
import SendingProgress from './SendingProgress';
import SingleContact from './SingleContact';
import './EmailSender.css';

const EmailSender = () => {
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const useCL = useContactList({ setMessage });
  const emailOptions = useEmailOptions({ useCL });
  const singleContactState = useSingleContact({ language: emailOptions.language });

  const { scopes } = loginRequest;
  const { instance, accounts } = useMsal();

  const onClickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accounts.length === 0) {
      setMessage('Please log in first');
      return false;
    }

    if (!emailOptions.selectedSubject) {
      setMessage('Please select or enter a subject');
      return false;
    }

    setSending(true);
    useCL.setEmailsSent(0);
    useCL.updateMaxSelectedContactsNotSent();
    let count = 0;
    const toSend = SINGLE_CONTACT_MODE
      ? [singleContactState.contact]
      : useCL.selectedContactsNotSent.slice(0, useCL.maxCount);
    for (const contact of toSend) {
      try {
        const sentStatus = await sendEmail(contact);
        if (!sentStatus) return;
        contact.sd = new Date().toISOString();
        setLogMessages((prev) => [...prev, `Email sent to ${contact.e}`]);
        await waitRandomSeconds(emailOptions.delay);
      } catch (error) {
        console.log('*Debug* -> EmailSender.tsx -> handleSendEmails -> error:', error);
        setLogMessages((prev) => [...prev, `Failed to send email to ${contact.e}`]);
      }
      count++;
      useCL.setEmailsSent(count);
      saveLocalContacts([...useCL.contacts, ...toSend]); // Save updated contacts for each email sent
      await new Promise((res) => setTimeout(res, emailOptions.delay * 1000));
    }
    useCL.setContacts([...useCL.contacts, ...toSend]); // Update local state when done
    setSending(false);
  };

  const sendEmail = async (contact: ContactI3C) => {
    setMessage('Sending email, please wait...');

    const emailText = mergeTemplate(emailTemplates[emailOptions.language], contact);

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes,
        account: accounts[0],
      });
      const accessToken = tokenResponse.accessToken;

      const response = await fetchSendEmail(
        URL_SEND_EMAIL,
        accessToken,
        contact,
        emailText,
        emailOptions.selectedSubject,
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status.toString()}`);

      const data = await response.text();
      const message = `${data} - ${new Date().toLocaleString()}`;
      setMessage(message);
      return true;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const tokenResponse = await instance.acquireTokenPopup({ scopes });
        const accessToken = tokenResponse.accessToken;

        const response = await fetchSendEmail(
          URL_SEND_EMAIL,
          accessToken,
          contact,
          emailText,
          emailOptions.selectedSubject,
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status.toString()}`);

        const data = await response.text();
        setMessage(data);
        return true;
      } else {
        setMessage(`Failed to send email: ${(error as Error).message}`);
      }
    }
  };

  const sendButtonDisabled =
    sending || (SINGLE_CONTACT_MODE ? !validateEmail(singleContactState.email) : !useCL.selectedContactsNotSent.length);

  return (
    <div className="email-sender-container">
      <div className="container">
        <div className="column"></div>
        <div className="columnRight">
          {accounts.length === 0 ? (
            <LogIn />
          ) : (
            <div className="logged-in-info">
              Logged in as {accounts[0].username} <LogOut />
            </div>
          )}
        </div>
      </div>

      <Header />

      <br />

      <form onSubmit={onClickSubmit} className="email-form">
        <div className="container">
          <div className="column">
            {SINGLE_CONTACT_MODE ? (
              <SingleContact state={singleContactState} />
            ) : (
              <SelectNations useCL={useCL} sending={sending} />
            )}
          </div>
          <br />

          <div className="columnRight">
            <EmailOptions useCL={useCL} emailOptions={emailOptions} singleContactMode={SINGLE_CONTACT_MODE} />
          </div>
          <br />
        </div>

        <button disabled={sendButtonDisabled} type="submit">
          Send Email
        </button>
        {message && <p>{message}</p>}

        <div className="email-preview-container">
          <EmailPreview
            emailText={SINGLE_CONTACT_MODE ? singleContactState.emailText : emailOptions.emailPreviewText}
          />
        </div>
      </form>

      {__DEV__ ? <button onClick={() => removeLocalStorageItem('contactsI3C')}>Empty local storage</button> : null}
      <br />
      {!SINGLE_CONTACT_MODE && <SendingProgress useCL={useCL} />}
      <br />
      {!SINGLE_CONTACT_MODE && <EmailsSentLog logMessages={logMessages} />}
    </div>
  );
};

export default EmailSender;
