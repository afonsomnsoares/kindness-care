import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/Toast';
import useAntiSpam from './useAntiSpam';

const FORMSUBMIT_URL =
  process.env.REACT_APP_API_URL || '/api/send-email';

/**
 * Lógica partilhada pelos formulários de Contacts.js e PousadasForm.js:
 * estado dos campos, anti-spam (honeypot + time-trap) e envio para
 * `/api/send-email` (Resend via Vercel serverless).
 *
 * @param {object} params
 * @param {object} params.initialData - valores iniciais/de reset do formulário.
 * @param {(formData: object) => object} params.buildPayload - constrói o
 *   corpo a enviar ao backend a partir do formData atual.
 * @param {string} params.successKey - chave i18n do toast de sucesso.
 * @param {string} params.errorKey - chave i18n do toast de erro.
 */
function useContactForm({ initialData, buildPayload, successKey, errorKey }) {
  const { t, i18n } = useTranslation();
  const addToast = useToast();
  const initialDataRef = useRef(initialData);

  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { honeypot, setHoneypot, isBot, startedAt } = useAntiSpam();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBot()) {
      // Finge sucesso para o bot sem gastar quota do backend nem
      // revelar que foi apanhado pelo anti-spam.
      addToast(t(successKey), 'success');
      setFormData(initialDataRef.current);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...buildPayload(formData),
          lang: i18n.language?.startsWith('en') ? 'en' : 'pt',
          website: honeypot,
          startedAt,
        }),
      });

      const result = await response.json();

      if (result.success) {
        addToast(t(successKey), 'success');
        setFormData(initialDataRef.current);
      } else {
        throw new Error(result.message || 'Erro no envio');
      }
    } catch (error) {
      addToast(t(errorKey), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isSubmitting,
    honeypot,
    setHoneypot,
  };
}

export default useContactForm;
