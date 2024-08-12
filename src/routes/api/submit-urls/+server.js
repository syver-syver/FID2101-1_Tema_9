// src/routes/api/cron/indexnow/+server.js
import { json } from '@sveltejs/kit';

const API_KEY = process.env.INDEXNOW_API_KEY;
const SITE_URL = 'https://syver.vercel.app';

export async function GET({ request }) {
  console.log('Cron job triggered');

  // Verify the request is from Vercel
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('Unauthorized request');
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
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

  console.log('Preparing to submit URLs:', fullUrls);
  console.log('IndexNow URL:', indexNowUrl);

  try {
    const indexNowResponse = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ urls: fullUrls })
    });

    console.log('IndexNow response status:', indexNowResponse.status);

    if (!indexNowResponse.ok) {
      const responseText = await indexNowResponse.text();
      console.error('IndexNow error response:', responseText);
      throw new Error(`Failed to submit URLs: ${indexNowResponse.status} ${responseText}`);
    }

    const responseData = await indexNowResponse.json();
    console.log('IndexNow response data:', responseData);

    return json({ success: true, message: 'URLs submitted successfully', data: responseData });
  } catch (error) {
    console.error('Error submitting URLs:', error.message);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}