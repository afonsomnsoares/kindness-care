# Kindness & Care

Website for **Kindness & Care** — home care, longevity, training and support during stays in Braga, Porto and Viana do Castelo. Portuguese and English. University of Minho spin-off.

Stack: React (Create React App) + Resend via Vercel serverless (`api/send-email.js`).

---

## How contact works

There are **two forms**, with different jobs. Both send email through the same endpoint (`POST /api/send-email`).

### 1. Contactos (`/contactos` · `/en/contacts`)

**For:** general enquiries and home-care leads.

| Need | What happens |
|------|----------------|
| Support **today** | Phone and WhatsApp are primary. Choosing “preciso de apoio hoje” shows call/WhatsApp CTAs. |
| Information / quote | Fill the form (name, email, phone, subject, message). Reply target: within 24h on business days. |
| **Pousadas** stay | Do **not** use this form. Choosing “Pousadas de Portugal” as subject steers the user to the dedicated Pousadas page. |

Also reachable from the home CTA, footer, and service pages (sometimes with `?assunto=...` prefilled).

### 2. Pousadas de Portugal (`/pousadas-portugal` · `/en/pousadas-portugal`)

**For:** guests who need care **during a stay** at a partner pousada.

Collects: name, phone (with country code), email, which pousada, check-in / check-out, and a free-text description of the service. Call/WhatsApp remain available as a fallback.

Tourism overview page (`Turismo de Saúde`) explains the offer and links here to request the service.

### Shared backend

| `_type` | Page | Email subject style |
|---------|------|---------------------|
| `contacto` | Contactos | Novo Contacto Website |
| `pousadas` | Pousadas form | Pedido Pousadas de Portugal |

Anti-spam: honeypot + minimum time before submit. Privacy consent required.

---

## Local development

```bash
cp .env.example .env   # then fill RESEND_API_KEY (for vercel / reference)
npm install
npm start              # React on :3000
```

To test forms end-to-end locally (API + frontend), use `vercel dev` with the Resend env vars set.

### Useful scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Frontend only |
| `npm test` | Jest tests |
| `npm run build` | Production build + SEO prerender |
| `npm run convert-images` | Image conversion helper |

---

## Environment

Copy `.env.example` → `.env`. Never commit `.env`. On Vercel, set the same keys in Project → Settings → Environment Variables.

| Variable | Required | Notes |
|----------|----------|--------|
| `RESEND_API_KEY` | Yes | From [resend.com](https://resend.com) → API Keys |
| `RESEND_FROM_EMAIL` | Yes (prod) | After domain verify: `Kindness & Care <geral@kindnesscare.pt>`. Until then: `Kindness & Care <onboarding@resend.dev>` |
| `ADMIN_EMAIL` | No | Defaults to `geral@kindnesscare.pt` |
| `CORS_ORIGIN` | Yes (prod) | e.g. `https://www.kindnesscare.pt` |

---

## Deploy (Vercel)

1. Import the repo in Vercel (uses `vercel.json`: build → `build/`, API in `api/`).
2. Set env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`, `CORS_ORIGIN`.
3. Deploy. Forms post to `/api/send-email` on the same domain.

Validate after deploy: `/`, `/contactos`, `/en`, `/pousadas-portugal`, `/og-image.jpg`.

---

## Project map

```
src/pages/          Page screens (Home, Contacts, Pousadas, services, legal…)
src/components/     Shared UI (nav, footer, forms helpers, SEO…)
src/hooks/          useContactForm, useAntiSpam
src/i18n/           PT/EN copy and routes
src/images/         Photos and partner logos
api/send-email.js   Vercel serverless form handler
lib/sendFormEmail.js Shared validation + Resend send
scripts/            prerender-seo, convert-images
public/             Static assets copied into build
```

Forms: `useContactForm` → `POST /api/send-email` → Resend → `ADMIN_EMAIL`, plus auto-reply to the visitor.
