import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || "dummy";

export const openai = new OpenAI({ 
  apiKey,
  dangerouslyAllowBrowser: true 
});
