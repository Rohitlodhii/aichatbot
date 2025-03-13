import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyA_z79endMuSBYKO02Vr3V1c1qnHj-QjxE');

export async function getGeminiResponse(prompt: string) {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Generate content and wait for the response
    const result = await model.generateContent(prompt);
    
    // Wait for the response to complete
    const response = await result.response;
    
    // Check if we have text in the response
    if (!response || !response.text) {
      throw new Error('Invalid response from Gemini API');
    }
    
    return response.text();
  } catch (error) {
    // Log the full error object for debugging
    console.error('Error getting Gemini response:', error);
    
    // Return a more user-friendly error message
    if (error instanceof Error) {
      throw new Error(`Failed to get AI response: ${error.message}`);
    } else {
      throw new Error('Failed to get AI response');
    }
  }
}