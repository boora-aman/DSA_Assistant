import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, leetCodeUrl } = await req.json();

    // Validate messages
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid messages format. Expected an array of messages.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate LeetCode URL (if provided)
    if (leetCodeUrl && !validateLeetCodeUrl(leetCodeUrl)) {
      return new Response(
        JSON.stringify({
          error: "Invalid LeetCode URL. Please provide a valid LeetCode problem URL.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if Gemini API key is present
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Dynamic system prompt
    const systemPrompt = `
You are a helpful teaching assistant for data structures and algorithms (DSA) problems.

Your goal is to help users understand and solve DSA problems on their own by:
1. Refrains from providing direct answers but instead focuses on guiding questions, related examples, and thought-provoking hints.
2. Providing guidance, hints, and building intuition
3. Asking leading questions that help them discover the solution
4. Explaining relevant concepts and patterns
5. Suggesting similar problems they might want to explore

Important rules:
- NEVER provide complete solutions to problems
- Focus on helping users understand the underlying concepts
- Use the Socratic method - ask questions to guide their thinking
- If a user is stuck, provide progressively more specific hints
- Explain time and space complexity when relevant
- When appropriate, suggest visualizing the problem with examples
- Format your responses with clear sections and bullet points
- Use markdown formatting for code snippets and examples
- When showing code, use proper syntax highlighting with \`\`\`language blocks

${
  leetCodeUrl
    ? `
The user is working on this LeetCode problem: ${leetCodeUrl}
Before addressing their question:
1. Briefly analyze the problem's key concepts
2. Identify the main data structures/algorithms involved
3. Guide them toward understanding the approach
`
    : ""
}
`;

    // Convert messages to Gemini format
    const geminiMessages = [
      { role: "user", parts: [{ text: systemPrompt }] },
      {
        role: "model",
        parts: [
          {
            text: "I understand my role as a DSA teaching assistant. I'll follow the guidelines to help users learn without providing complete solutions.",
          },
        ],
      },
    ];

    // Add the conversation history
    let isUserMessage = true; // To alternate between user/model messages
    for (let i = 0; i < messages.length; i++) {
      // Skip the first assistant message that's in your UI by default
      if (i === 0 && messages[i].role === "assistant") continue;

      const role = isUserMessage ? "user" : "model";
      geminiMessages.push({
        role: role,
        parts: [{ text: messages[i].content }],
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
        maxOutputTokens: 4096,
      },
    });

    // Get the response
    const lastMessage = geminiMessages[geminiMessages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;

    // Return the response
    return new Response(
      JSON.stringify({
        content: response.text(),
        role: "assistant",
        status: "success",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error calling Gemini:", error);

    // Handle specific Gemini API errors
    if (error.name === "GoogleGenerativeAIError") {
      return new Response(
        JSON.stringify({
          error: "Failed to generate response. Please try rephrasing your question.",
          details: error.message,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle rate limiting
    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again in a moment.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Helper function to validate LeetCode URLs
function validateLeetCodeUrl(url: string): boolean {
  const leetCodeRegex = /^https:\/\/(leetcode\.com|leetcode\.cn)\/problems\/[a-zA-Z0-9-]+\/?/;
  return leetCodeRegex.test(url);
}