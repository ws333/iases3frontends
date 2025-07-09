import { useState } from 'react';
import { ContactI3C, KeyOfTemplatesHTML } from '../types/types';
import { emailTemplates } from '../constants/emailTemplates';
import { mergeTemplate } from '../helpers/mergeTemplate';

type UseSingleContactArgs = {
  language: KeyOfTemplatesHTML;
};

function useSingleContact({ language }: UseSingleContactArgs) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const contact: ContactI3C = {
    uid: Date.now(),
    n: name,
    e: email,
    na: '',
    i: '',
    sd: '',
    ud: '',
  };
  const emailText = mergeTemplate(emailTemplates[language], contact);

  return {
    name,
    setName,
    email,
    setEmail,
    emailText,
    contact,
  };
}

export { useSingleContact };
