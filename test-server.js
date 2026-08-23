// SERVIDOR DE TESTE LOCAL - NÃO usar em produção.
// Este ficheiro fica na raiz do projeto (fora de public/) de propósito:
// o build do CRA só copia o conteúdo de public/, por isso nunca é
// publicado em produção nem incluído no bundle do browser.
//
// Em produção os formulários usam FormSubmit (ver handleSubmit em:
//   src/pages/Contacts.js e src/pages/Health-Tourism.js,
//   com anti-spam honeypot + time-trap em src/hooks/useAntiSpam.js).
//
// Este servidor serve apenas para testar os formulários localmente:
//   node test-server.js
// Usa Ethereal (https://ethereal.email), serviço de email fake do nodemailer.
// Os emails nunca chegam a lado nenhum - abre o "Preview URL" na consola.

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function createTransport() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

app.post('/send-email', async (req, res) => {
  try {
    const transporter = await createTransport();
    const body = req.body;
    const type = body._type || 'contacto';
    const replyto = body._replyto || '';

    let subject, text;
    if (type === 'pousadas') {
      subject = 'Pedido Pousadas de Portugal - ' + (body.Nome || '');
      text = 'Pedido Pousadas de Portugal\n\n';
      for (const [k, v] of Object.entries(body)) {
        if (k !== '_type' && k !== '_replyto') text += `${k}: ${v}\n`;
      }
    } else {
      subject = 'Novo Contacto Website - ' + (body.Nome || '');
      text = 'Contacto do Website\n\n';
      for (const [k, v] of Object.entries(body)) {
        if (k !== '_type' && k !== '_replyto') text += `${k}: ${v}\n`;
      }
    }

    const info = await transporter.sendMail({
      from: '"Kindness & Care" <noreply@kindnesscare.pt>',
      to: body._test_email || 'geral@kindnesscare.pt',
      replyTo: replyto,
      subject,
      text,
    });

    console.log('\n✅ Email enviado!');
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('📋 Assunto:', subject);
    console.log('📄 Conteúdo:\n' + text);

    res.json({ success: true, preview: nodemailer.getTestMessageUrl(info) });
  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de teste: http://localhost:${PORT}`);
  console.log(`📝 Os formulários do React devem apontar para http://localhost:${PORT}/send-email\n`);
});