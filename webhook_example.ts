
/**
 * EXAMPLE STRIPE WEBHOOK HANDLER
 * 
 * Deployment: This would be an API route or Cloud Function.
 * Endpoint: https://your-domain.com/api/webhooks/stripe
 */

/*
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve the metadata or find the purchase by session_id
    // Session object has: id, payment_intent, customer_email, etc.
    
    // Update purchase in Supabase
    const { error } = await supabase
      .from('purchases')
      .update({ 
        status: 'completed',
        stripe_payment_intent_id: session.payment_intent 
      })
      .eq('stripe_checkout_session_id', session.id);

    if (error) {
      console.error('Failed to update purchase record:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  res.json({ received: true });
}
*/
