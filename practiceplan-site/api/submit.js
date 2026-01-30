export default async function handler(req, res) {
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
    return res.status(500).json({ error: 'Server configuration error' });
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Close API error:', errorText);
      return res.status(500).json({ error: 'Failed to create lead' });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, leadId: result.id });

  } catch (error) {
    console.error('Error submitting to Close:', error);
    return res.status(500).json({ error: 'Failed to submit form' });
  }
}
