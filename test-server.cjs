// SERVIDOR DE TESTE LOCAL - NÃO usar em produção.
// Este ficheiro fica na raiz do projeto (fora de public/) de propósito:
// o build só inclui public/ e o código importado a partir de src/, por isso nunca é
// publicado em produção nem incluído no bundle do browser.
//
// Em produção os formulários usam FormSubmit (ver src/hooks/useContactForm.js,
// com anti-spam honeypot + time-trap em src/hooks/useAntiSpam.js).
//
// Para testar os formulários localmente sem enviar emails reais:
//   1. Crie um ficheiro .env.local com:
//        VITE_FORM_ENDPOINT=http://localhost:4000/send-email
//   2. Num terminal: npm run test-server
//   3. Noutro terminal: npm run dev
// Usa Ethereal (https://ethereal.email), serviço de email fake do nodemailer.
// Os emails nunca chegam a lado nenhum - abre o "Preview URL" na consola.

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// O site corre noutra porta (npm run dev), por isso o browser precisa de CORS.
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

let transporterPromise;
function getTransport() {
  transporterPromise ??= nodemailer.createTestAccount().then((testAccount) =>
    nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  );
  return transporterPromise;
}

app.post('/send-email', async (req, res) => {
  try {
    const transporter = await getTransport();
    const body = req.body;

    // Os campos começados por "_" são opções do FormSubmit, não dados.
    const subject = body._subject || 'Contacto do Website';
    const text = Object.entries(body)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const info = await transporter.sendMail({
      from: '"Kindness & Care" <noreply@kindnesscare.pt>',
      to: 'geral@kindnesscare.pt',
      replyTo: body.email || undefined,
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
  console.log(`📝 Defina VITE_FORM_ENDPOINT=http://localhost:${PORT}/send-email em .env.local\n`);
});
