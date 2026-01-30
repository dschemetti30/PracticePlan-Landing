module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get form data from request
  const { name, email, organization, role, facilities, current_process, facility_types } = req.body;

  // Your Close API key (stored securely in Vercel environment variables)
  const apiKey = process.env.CLOSE_API_KEY;

  if (!apiKey) {
    console.error('CLOSE_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error - API key missing' });
  }

  // Build the lead data for Close CRM
  const leadData = {
    name: organization || 'Unknown Organization',
    contacts: [
      {
        name: name,
        emails: [{ email: email }]
      }
    ],
    // Store additional info in the lead description/notes
    description: `Role: ${role}\nFacilities: ${facilities}\nCurrent Process: ${current_process}\nFacility Types: ${facility_types || 'Not specified'}`
  };

  console.log('Attempting to create lead:', JSON.stringify(leadData));

  try {
    // Send to Close CRM API
    const response = await fetch('https://api.close.com/api/v1/lead/', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    const responseText = await response.text();
    console.log('Close API response status:', response.status);
    console.log('Close API response:', responseText);

    if (!response.ok) {
      console.error('Close API error:', responseText);
      return res.status(500).json({ error: 'Failed to create lead', details: responseText });
    }

    const result = JSON.parse(responseText);
    return res.status(200).json({ success: true, leadId: result.id });

  } catch (error) {
    console.error('Error submitting to Close:', error.message);
    return res.status(500).json({ error: 'Failed to submit form', details: error.message });
  }
}
