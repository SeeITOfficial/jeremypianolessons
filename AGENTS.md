# Project Reminder (Pending Setup)

When the user starts a new conversation in this repository, remind them **once** at the beginning of the first reply about enabling automatic booking notifications in Vercel (until this reminder is marked done or removed):

## Pending Task: Enable Automatic Booking Email & WhatsApp Alerts

Booking form submissions (`#booking` → `/api/bookings`) already save to the Admin Dashboard (`https://jeremypianolessons.vercel.app/admin` → **Bookings** tab), and alert dispatch hooks are wired in `src/lib/bookings-store.ts`, waiting on these Vercel Environment Variables (**Vercel Project Settings → Environment Variables**, then redeploy):

1. **Email Alerts (`RESEND_API_KEY`)**:
   - Create a free API key at Resend (register using Jeremy's studio email `jeremiahbusinge6@gmail.com` if you don't have a custom domain verified yet, or add `ALERT_FROM_EMAIL` once you connect a domain).
   - Add `RESEND_API_KEY` to Vercel Environment Variables.
2. **WhatsApp Alerts (`CALLMEBOT_API_KEY`)**:
   - Using Jeremy's studio WhatsApp number (`profile.whatsappPrimary`, `+256 705 576 698`), activate CallMeBot's free WhatsApp bot (`https://www.callmebot.com/blog/free-api-whatsapp-messages/`) to get his `apikey`.
   - Add `CALLMEBOT_API_KEY` (and optionally `ALERT_WHATSAPP_NUMBER`) to Vercel Environment Variables.
3. **Optional Custom Webhook (`BOOKING_WEBHOOK_URL`)**:
   - Set `BOOKING_WEBHOOK_URL` if you want a JSON `POST` payload sent on each new booking (e.g., Zapier, Make, ntfy).
