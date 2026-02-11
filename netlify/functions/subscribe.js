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

    // Subscribe to ConvertKit
    const response = await fetch(`${CONVERTKIT_API_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        email: email,
        first_name: firstName || '',
        tags: [tag]
      })
    });

    const data = await response.json();

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
