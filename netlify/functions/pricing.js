// Netlify Function to fetch pricing data (bypasses CORS)
// Endpoint: /.netlify/functions/pricing

exports.handler = async function(event, context) {
  try {
    // Fetch all data in parallel
    const [btcMxnRes, btcUsdRes, goldRes, fxRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn&include_24hr_change=true'),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true'),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=mxn&include_24hr_change=true')
    ]);

    const [btcMxnData, btcUsdData, goldData, fxData] = await Promise.all([
      btcMxnRes.json(),
      btcUsdRes.json(),
      goldRes.json(),
      fxRes.json()
    ]);

    // Extract and structure the data
    const data = {
      btcMxn: {
        price: btcMxnData.bitcoin.mxn,
        change: btcMxnData.bitcoin.mxn_24h_change
      },
      btcUsd: {
        price: btcUsdData.bitcoin.usd,
        change: btcUsdData.bitcoin.usd_24h_change
      },
      goldUsd: {
        price: goldData['pax-gold'].usd,
        change: goldData['pax-gold'].usd_24h_change
      },
      usdMxn: {
        price: fxData.tether.mxn,
        change: fxData.tether.mxn_24h_change
      },
      // Calculate BTC/XAU
      btcXau: {
        price: btcUsdData.bitcoin.usd / goldData['pax-gold'].usd,
        change: btcUsdData.bitcoin.usd_24h_change - goldData['pax-gold'].usd_24h_change
      },
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error fetching pricing data:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch pricing data',
        message: error.message 
      })
    };
  }
};
