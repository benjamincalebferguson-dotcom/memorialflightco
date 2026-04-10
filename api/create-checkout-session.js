const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover'
});

const OFFERINGS = {
  signature: {
    name: 'Signature Scattering at Your Chosen Location',
    amount: 220000,
    description: 'A premium memorial ceremony arranged for a location of your choosing, subject to suitability, weather, and operational review.'
  },
  sorrento: {
    name: 'Sorrento Memorial Sanctuary',
    amount: 118500,
    description: 'A memorial ceremony at the fixed Sorrento Memorial Sanctuary location.'
  },
  tribute: {
    name: 'Tribute Film Add-on',
    amount: 95000,
    description: 'Additional drone filming of the full experience with a delivered tribute film.'
  }
};

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return json(res, 500, { error: 'Stripe secret key is not configured' });
  }

  try {
    const { packageType, addTributeFilm } = await parseRequestBody(req);
    const selectedPackage = OFFERINGS[packageType];

    if (!selectedPackage) {
      return json(res, 400, { error: 'Invalid package selected' });
    }

    const lineItems = [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: selectedPackage.name,
            description: selectedPackage.description
          },
          unit_amount: selectedPackage.amount
        },
        quantity: 1
      }
    ];

    if (packageType !== 'tribute' && addTributeFilm) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: OFFERINGS.tribute.name,
            description: OFFERINGS.tribute.description
          },
          unit_amount: OFFERINGS.tribute.amount
        },
        quantity: 1
      });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true
      },
      line_items: lineItems,
      metadata: {
        packageType,
        tributeFilm: addTributeFilm ? 'yes' : 'no'
      },
      success_url: `${origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout-cancelled.html`
    });

    return json(res, 200, { url: session.url });
  } catch (error) {
    return json(res, 500, {
      error: 'Unable to create checkout session',
      details: error.message
    });
  }
};
