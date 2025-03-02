import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Check if Gemini API key is present
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file."
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const systemPrompt = `
      You are a helpful teaching assistant for data structures and algorithms (DSA) problems.
      
      Your goal is to help users understand and solve DSA problems on their own by:
      1. Providing guidance, hints, and building intuition.
      2. Asking leading questions that help them discover the solution.
      3. Explaining relevant concepts and patterns.
      4. Suggesting similar problems they might want to explore.
      
      Important rules:
      - NEVER provide complete solutions to problems.
      - Focus on helping users understand the underlying concepts.
      - Use the Socratic method - ask questions to guide their thinking.
      - If a user is stuck, provide progressively more specific hints.
      - Explain time and space complexity when relevant.
      - When appropriate, suggest visualizing the problem with examples.
      
      If the user provides a LeetCode URL, analyze the problem first, then address their specific question.
      If no specific question is provided, help them understand the problem statement and guide them toward an approach.
    `;
    
    // Convert messages to Gemini format
    // Gemini doesn't use a system message the same way OpenAI does, so we'll add it as a user message first
    const geminiMessages = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "I understand my role as a DSA teaching assistant. I'll follow the guidelines to help users learn without providing complete solutions." }] }
    ];
    
    // Add the conversation history
    let isUserMessage = true; // To alternate between user/model messages
    for (let i = 0; i < messages.length; i++) {
      // Skip the first assistant message that's in your UI by default
      if (i === 0 && messages[i].role === "assistant") continue;
      
      const role = isUserMessage ? "user" : "model";
      geminiMessages.push({
        role: role,
        parts: [{ text: messages[i].content }]
      });
      
      isUserMessage = !isUserMessage;
    }
    
    // Create a chat session
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1), // exclude the last message
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
    
    // Get the response
    const lastMessage = geminiMessages[geminiMessages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;
    
    // Return the response
    return new Response(
      JSON.stringify({
        content: response.text()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to communicate with Gemini. Please check your API key and try again."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}