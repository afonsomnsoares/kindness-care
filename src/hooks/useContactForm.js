import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/Toast';
import useAntiSpam from './useAntiSpam';

// Endereço para onde os formulários são enviados. Por omissão é o FormSubmit;
// VITE_FORM_ENDPOINT permite usar o alias aleatório do FormSubmit (para não
// expor o email no código) ou o servidor de teste local (ver .env.example).
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  'https://formsubmit.co/ajax/geral@kindnesscare.pt';

/**
 * Lógica partilhada pelos formulários de Contacts.jsx e Pousadas.jsx:
 * estado dos campos, anti-spam (honeypot + time-trap) e envio para o
 * FormSubmit, com toasts de sucesso/erro e reset do formulário.
 *
 * @param {object} params
 * @param {object} params.initialData - valores iniciais/de reset do formulário.
 * @param {(formData: object) => object} params.buildPayload - constrói o
 *   corpo a enviar ao FormSubmit a partir do formData atual.
 * @param {string} params.successKey - chave i18n do toast de sucesso.
 * @param {string} params.errorKey - chave i18n do toast de erro.
 */
function useContactForm({ initialData, buildPayload, successKey, errorKey }) {
  const { t } = useTranslation();
  const addToast = useToast();
  const initialDataRef = useRef(initialData);

  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { honeypot, setHoneypot, isBot } = useAntiSpam();

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
      // Finge sucesso para o bot sem gastar quota do FormSubmit nem
      // revelar que foi apanhado pelo anti-spam.
      addToast(t(successKey), 'success');
      setFormData(initialDataRef.current);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildPayload(formData)),
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
