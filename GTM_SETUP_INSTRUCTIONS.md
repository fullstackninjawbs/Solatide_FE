# GTM + GA4 Setup Instructions for Order Attribution

## 1. Google Tag Manager (GTM) Configuration
1. Install the GTM Snippet in `index.html` (in the `<head>` and `<body>` tags).
2. Inside GTM, create a new **GA4 Configuration Tag** and enter your Measurement ID. Set it to trigger on **All Pages**.

## 2. Capture UTMs and Click IDs
In GTM, create **URL Variables** (Type: URL -> Component: Query) for each of the following:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`
- `gclid`, `fbclid`, `ttclid`, `msclkid`

*(Note: Our frontend `attribution.ts` utility already automatically captures these from the URL and stores them in cookies/localStorage independent of GTM. GTM only needs these if you want to push them directly to GA4.)*

## 3. GA4 Purchase Tracking (Avoiding Duplicates)
We need to trigger a `purchase` event ONLY once per paid order, using the local Order ID.

1. Create a **Data Layer Variable** for `transaction_id`.
2. Create a **Custom Event Trigger** called `purchase`.
3. Create a **GA4 Event Tag** for `purchase`. Map the following Event Parameters to your Data Layer variables:
   - `transaction_id`
   - `value`
   - `currency`
   - `items`
   - `attribution_source`
   - `attribution_channel`

**CRITICAL RULE:** Do NOT make GTM responsible for saving the order attribution in MongoDB. That is already handled by our backend Checkout API (`POST /api/payments/tagada/create`). GTM is exclusively for pushing data to Google Analytics.
