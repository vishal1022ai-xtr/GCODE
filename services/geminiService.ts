import { GoogleGenAI, Chat } from "@google/genai";
// Fix: Corrected import path for types from './types' to '../types'.
import type { ChatMessage, Prescription } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const systemInstruction = `You are "MediMinder AI", a friendly, multilingual AI healthcare assistant for a medicine reminder app. 
Your role is to answer patient questions about their medication, side effects, and general well-being in a simple, clear, and supportive manner. 
You can understand and respond in multiple languages, including Hinglish (e.g., "Ye dawa kab leni hai?").
You MUST NOT provide medical advice that replaces a doctor. For any serious concerns, or questions about changing dosage, always guide the user to consult their doctor.
You have been provided with the patient's current prescription. Use it as context for your answers.
Keep your answers concise and easy to understand.`;

export const getAIResponse = async (
  chat: Chat | null,
  history: ChatMessage[], 
  newMessage: string, 
  prescription: Prescription
): Promise<{ chat: Chat; response: string }> => {

  const prescriptionContext = `Current Prescription for the user:\n` +
    prescription.medications.map(med => `- ${med.name} (${med.dosage}): ${med.schedule.map(s => s.time).join(', ')}`).join('\n');
  
  let currentChat = chat;
  if (!currentChat) {
      currentChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `${systemInstruction}\n\n${prescriptionContext}`,
      },
      history: history,
    });
  }

  const result = await currentChat.sendMessage({ message: newMessage });
  return { chat: currentChat, response: result.text };
};