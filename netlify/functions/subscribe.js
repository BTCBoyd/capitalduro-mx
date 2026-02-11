// Netlify Function: ConvertKit subscription handler
// Uses ConvertKit Forms API (more reliable than Tags API)

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_SECRET;

// Form IDs from ConvertKit
const FORMS = {
  'newsletter': '9078414',
  'reporte-descarga': '9078422'
};

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

    if (!tag || !FORMS[tag]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid tag. Must be newsletter or reporte-descarga' })
      };
    }

    const formId = FORMS[tag];
    
    console.log(`Subscribing ${email} to form ${formId} (${tag})`);

    // Subscribe to ConvertKit form
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email,
        first_name: firstName || ''
      })
    });

    const data = await response.json();
    console.log('ConvertKit response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('ConvertKit API error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Subscription failed',
          details: data.message || data.error || 'Unknown error'
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
        formId: formId,
        segment: tag
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
