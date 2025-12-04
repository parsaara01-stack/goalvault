// api/goals.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, year, goals } = req.body;

    // Validate input
    if (!name || !email || !goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Email content
    const emailContent = `
Hello ${name}!

Your ${year} goals have been saved in GoalVault:

${goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

Keep this email as a reminder of your commitments!

Best wishes,
GoalVault Team
    `;

    // Send email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'GoalVault <onboarding@resend.dev>',
          to: email,
          subject: `Your ${year} Goals - GoalVault`,
          text: emailContent
        })
      });

      if (!emailResponse.ok) {
        console.error('Email send failed:', await emailResponse.text());
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Goals saved successfully',
      goalsCount: goals.length
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
}
```

---

### Part D: Check Your Work

Open your `goalvault` folder. You should see:
```
goalvault/
  ├── index.html (file)
  └── api/ (folder)
      └── goals.js (file inside api folder)
