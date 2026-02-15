const GenAIModule = require('@google/genai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY missing in .env');
}

const ai = new GenAIModule.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function extractText(response) {
  try {
    console.log('Extracting text from response...');
    
    // handle candidates -> content -> parts -> text
    if (response?.candidates && Array.isArray(response.candidates) && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      console.log('candidate.content:', candidate.content);
      
      const content = candidate.content;
      
      // content is an object with parts array
      if (content && Array.isArray(content.parts)) {
        const text = content.parts.map(part => part.text || '').join(' ').trim();
        console.log('extracted from parts:', text);
        if (text) return String(text);
      }
      
      // fallback: if content is array
      if (Array.isArray(content)) {
        const text = content.flatMap(c => (c.parts || []).map(p => p.text || '')).join(' ').trim();
        console.log('extracted from content array:', text);
        if (text) return String(text);
      }
    }

    // fallback for other response shapes
    if (response?.contents && Array.isArray(response.contents)) {
      return response.contents.map(c => (c.parts || []).map(p => p.text || '').join('')).join('\n').trim();
    }

    console.warn('Could not extract text, returning stringified response');
    return JSON.stringify(response);
  } catch (e) {
    console.error('Error extracting text:', e);
    return String(response);
  }
}

async function getOpenAIResponse(messages = []) {
  try {
    console.log(' ENTERED getOpenAIResponse()');
    console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

    const contents = messages.map(m => ({
      role: (m.role || 'user').toLowerCase() === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content ?? m.text ?? '') }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    console.log('raw genai response:', response);

    const text = extractText(response);
    console.log('final extracted text:', text);
    
    return String(text ?? '');
  } catch (err) {
    console.error('❌ Gemini API Error:', err?.response || err?.message || err);
    throw err;
  }
}

module.exports = getOpenAIResponse;