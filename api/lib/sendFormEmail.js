/**
 * Shared form → email logic for Contactos and Pousadas.
 * Used by the Vercel serverless function (api/send-email.js).
 */
const { Resend } = require('resend');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealIsoDate(value) {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

function clip(value, max) {
  return String(value || '').replace(/[\u0000\r\n]/g, ' ').trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function textToHtml(text) {
  return `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap;line-height:1.5">${escapeHtml(text)}</pre>`;
}

/**
 * @param {object} body - JSON body from the form
 * @returns {Promise<{ status: number, json: object }>}
 */
async function handleFormSubmission(body = {}) {
  const lang = (body.lang || 'pt').toString();
  const customerLang = lang === 'en' ? 'en' : 'pt';
  const isEn = customerLang === 'en';

  const {
    nome,
    email,
    telefone,
    assunto,
    mensagem,
    pais,
    contacto,
    pousada,
    check_in,
    check_out,
    servico,
    _type,
    privacy,
    privacidade,
  } = body;

  if (body.website) {
    return { status: 200, json: { success: true, message: 'ok' } };
  }

  const startedAt = Number(body.startedAt);
  const elapsed = Date.now() - startedAt;
  const clockSkewMs = 2 * 60 * 1000;
  const tooFast = Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 3000;
  const implausible = !Number.isFinite(startedAt) || startedAt <= 0
    || elapsed > 6 * 60 * 60 * 1000
    || elapsed < -clockSkewMs;
  if (implausible || tooFast) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn ? 'Please wait a moment and try again.' : 'Aguarde um momento e tente novamente.',
      },
    };
  }

  const safeNome = clip(nome, 120);
  const safeEmail = clip(email, 160);
  const safeMensagem = String(mensagem || '').replace(/\u0000/g, '').trim().slice(0, 4000);
  const safeTelefone = clip(telefone || contacto, 40);
  const safePousada = clip(pousada, 160);
  const safeServico = String(servico || '').replace(/\u0000/g, '').trim().slice(0, 1000);
  const safeCheckIn = clip(check_in, 40);
  const safeCheckOut = clip(check_out, 40);
  const safeAssunto = clip(assunto, 160);

  const isPousadas = _type === 'pousadas';
  const hasPrivacyConsent = privacy === true || privacy === 'true'
    || privacidade === true || privacidade === 'true' || privacidade === 'on';

  if (!hasPrivacyConsent) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn
          ? 'Privacy policy consent is required.'
          : 'É necessário aceitar a Política de Privacidade.',
      },
    };
  }

  if (!safeNome || !safeEmail) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn
          ? 'Missing required fields (name, email).'
          : 'Campos obrigatórios em falta (nome, email).',
      },
    };
  }

  const phoneMissing = !safeTelefone || /^(não fornecido|nao fornecido|not provided)$/i.test(safeTelefone);
  if (!isPousadas && (!safeMensagem || phoneMissing)) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn
          ? 'Missing required fields (name, email, phone, message).'
          : 'Campos obrigatórios em falta (nome, email, telefone, mensagem).',
      },
    };
  }

  if (isPousadas && (!safePousada || !safeServico || !safeCheckIn || !safeCheckOut)) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn
          ? 'Missing required Pousadas fields (pousada, service, check-in, check-out).'
          : 'Campos obrigatórios em falta (pousada, serviço, check-in, check-out).',
      },
    };
  }

  if (isPousadas && safeTelefone.replace(/\D/g, '').length < 6) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn
          ? 'Enter a valid phone number.'
          : 'Indique um número de telefone válido.',
      },
    };
  }

  if (isPousadas && (!isRealIsoDate(safeCheckIn) || !isRealIsoDate(safeCheckOut) || safeCheckOut <= safeCheckIn)) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn
          ? 'Check-out must be after check-in.'
          : 'O check-out tem de ser posterior ao check-in.',
      },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(safeEmail)) {
    return {
      status: 400,
      json: {
        success: false,
        message: isEn ? 'Invalid email.' : 'Email inválido.',
      },
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return {
      status: 503,
      json: {
        success: false,
        message: isEn
          ? 'The contact service is temporarily unavailable. Please call us.'
          : 'O serviço de contacto está temporariamente indisponível. Por favor ligue-nos.',
      },
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'geral@kindnesscare.pt';
  const fromEmail = process.env.RESEND_FROM_EMAIL
    || 'Kindness & Care <onboarding@resend.dev>';

  const messageBody = isPousadas
    ? (safeMensagem || [
        'Pedido de serviço nas Pousadas de Portugal',
        `Pousada: ${safePousada}`,
        `Serviço: ${safeServico}`,
        `Check-in: ${safeCheckIn}`,
        `Check-out: ${safeCheckOut}`,
        pais ? `País: ${clip(pais, 80)}` : null,
      ].filter(Boolean).join('\n'))
    : safeMensagem;

  const adminSubject = isPousadas
    ? `Pedido Pousadas de Portugal - ${safeNome}`
    : `Novo Contacto Website - ${safeNome}`;

  const adminText = `
NOVO PEDIDO - Kindness & Care
==============================

Tipo: ${isPousadas ? 'Pousadas de Portugal' : 'Contacto geral'}
Nome: ${safeNome}
Email: ${safeEmail}
Telefone: ${safeTelefone || 'Não fornecido'}
Assunto: ${safeAssunto || (isPousadas ? 'Pedido Pousadas' : 'Sem assunto')}

${isPousadas ? `País: ${clip(pais, 80) || 'Não especificado'}\nPousada: ${safePousada}\nCheck-in: ${safeCheckIn}\nCheck-out: ${safeCheckOut}\nServiço solicitado: ${safeServico}\n\n` : ''}Mensagem:
${messageBody}

Enviado em: ${new Date().toISOString()}
Origem: https://www.kindnesscare.pt
  `.trim();

  const customerSubject = isEn
    ? 'We received your message - Kindness & Care'
    : 'Recebemos a sua mensagem - Kindness & Care';

  const customerText = isEn
    ? `
Hello ${safeNome},

Thank you for contacting Kindness & Care. We have received your message and will get back to you as soon as possible.

Your details:
- Name: ${safeNome}
- Email: ${safeEmail}
- Phone: ${safeTelefone || 'Not provided'}
- Subject: ${safeAssunto || (isPousadas ? 'Pousadas request' : 'Not specified')}

The phone line is available 24 hours a day. Care visits are arranged with you.
You can also call +351 968 844 420 or +351 933 929 761, or use WhatsApp.

Best regards,
Kindness & Care Team
https://www.kindnesscare.pt
    `.trim()
    : `
Olá ${safeNome},

Obrigado por contactar a Kindness & Care. Recebemos a sua mensagem e entraremos em contacto consigo o mais brevemente possível.

Os seus dados:
- Nome: ${safeNome}
- Email: ${safeEmail}
- Telefone: ${safeTelefone || 'Não fornecido'}
- Assunto: ${safeAssunto || (isPousadas ? 'Pedido Pousadas' : 'Não especificado')}

A linha telefónica está disponível 24 horas. As visitas de cuidado são marcadas consigo.
Pode também ligar para +351 968 844 420 ou +351 933 929 761, ou usar o WhatsApp.

Cumprimentos,
Equipa Kindness & Care
https://www.kindnesscare.pt
    `.trim();

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: adminError } = await resend.emails.send({
    from: fromEmail,
    to: [adminEmail],
    replyTo: safeEmail,
    subject: adminSubject,
    text: adminText,
    html: textToHtml(adminText),
  });

  if (adminError) {
    console.error('Resend admin email failed:', adminError);
    return {
      status: 500,
      json: {
        success: false,
        message: isEn
          ? 'Internal error sending email. Please try again.'
          : 'Erro interno ao enviar email. Tente novamente.',
      },
    };
  }

  const { error: customerError } = await resend.emails.send({
    from: fromEmail,
    to: [safeEmail],
    subject: customerSubject,
    text: customerText,
    html: textToHtml(customerText),
  });

  if (customerError) {
    console.error('Resend auto-responder failed:', customerError.message || customerError);
  }

  return {
    status: 200,
    json: {
      success: true,
      message: isEn
        ? 'Message sent successfully. We will contact you shortly.'
        : 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.',
    },
  };
}

module.exports = { handleFormSubmission };
