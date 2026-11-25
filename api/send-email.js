/**
 * Vercel serverless function: POST /api/send-email
 * Keeps RESEND_API_KEY on the server — never expose it in the React app.
 */
const { handleFormSubmission } = require('./lib/sendFormEmail');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://www.kindnesscare.pt');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  try {
    const result = await handleFormSubmission(req.body || {});
    return res.status(result.status).json(result.json);
  } catch (err) {
    console.error('send-email function error:', err.message || err);
    return res.status(500).json({
      success: false,
      message: 'Internal error sending email. Please try again.',
    });
  }
};
