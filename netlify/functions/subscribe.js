// Netlify Function: ConvertKit subscription handler
// Handles both newsletter signups and report downloads with proper segmentation

const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, tag, firstName } = JSON.parse(event.body);

    // Validate inputs
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Valid email required' })
      };
    }

    if (!tag || !['newsletter', 'reporte-descarga'].includes(tag)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid tag' })
      };
    }

    // First, add subscriber with tag using the form endpoint
    // ConvertKit requires tag ID, so we'll use the simpler approach: add subscriber first, then tag
    
    // Step 1: Add/update subscriber
    const subscriberResponse = await fetch(`${CONVERTKIT_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        email: email,
        first_name: firstName || ''
      })
    });
    
    const subscriberData = await subscriberResponse.json();
    
    if (!subscriberResponse.ok) {
      console.error('ConvertKit subscriber error:', subscriberData);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Subscription failed',
          details: subscriberData.message || 'Unknown error'
        })
      };
    }
    
    const subscriberId = subscriberData.subscriber?.id;
    
    // Step 2: Tag the subscriber
    const tagResponse = await fetch(`${CONVERTKIT_API_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        tag: {
          name: tag
        },
        email: email
      })
    });
    
    const response = tagResponse;
    const data = await tagResponse.json();

    if (!response.ok) {
      console.error('ConvertKit API error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Subscription failed',
          details: data.message || 'Unknown error'
        })
      };
    }

    // Success
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed',
        tag: tag
      })
    };

  } catch (error) {
    console.error('Subscription error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
