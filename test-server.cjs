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
//        PUBLIC_FORM_ENDPOINT=http://localhost:4000/send-email
//   2. Num terminal: npm run test-server
//   3. Noutro terminal: npm run dev
// Usa Ethereal (https://ethereal.email), serviço de email fake do nodemailer.
// Os emails nunca chegam a lado nenhum - abre o "Preview URL" na consola.

const http = require('node:http');
const nodemailer = require('nodemailer');

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

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

async function sendEmail(req, res) {
  try {
    const transporter = await getTransport();
    const body = await readJson(req);

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

    sendJson(res, 200, { success: true, preview: nodemailer.getTestMessageUrl(info) });
  } catch (err) {
    console.error('Erro:', err.message);
    sendJson(res, 500, { success: false, message: err.message });
  }
}

const server = http.createServer((req, res) => {
  // O site corre noutra porta (npm run dev), por isso o browser precisa de CORS.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
  } else if (req.method === 'POST' && req.url === '/send-email') {
    sendEmail(req, res);
  } else {
    sendJson(res, 404, { success: false, message: 'Not found' });
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`\n🚀 Servidor de teste: http://localhost:${PORT}`);
  console.log(`📝 Defina PUBLIC_FORM_ENDPOINT=http://localhost:${PORT}/send-email em .env.local\n`);
});
