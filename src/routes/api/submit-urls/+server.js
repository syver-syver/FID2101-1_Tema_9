// src/api/cron/indexnow.js
const API_KEY = process.env.INDEXNOW_API_KEY;
const SITE_URL = 'https://syver.vercel.app';

export default async function handler(request, response) {
  // Verify the request is from Vercel
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ success: false });
  }

  const urls = [
    '/',
    '/en',
    '/projects/tema_8',
    '/en/projects/tema_8',
    '/projects/tema_5',
    '/en/projects/tema_5',
    '/projects/tema_16',
    '/en/projects/tema_16'
  ];

  const fullUrls = urls.map(url => `${SITE_URL}${url}`);

  const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITE_URL)}&key=${API_KEY}`;

  try {
    const indexNowResponse = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ urls: fullUrls })
    });

    if (!indexNowResponse.ok) {
      throw new Error('Failed to submit URLs');
    }

    return response.status(200).json({ success: true, message: 'URLs submitted successfully' });
  } catch (error) {
    console.error('Error submitting URLs:', error);
    return response.status(500).json({ success: false, message: error.message });
  }
}