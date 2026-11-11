import OpenAI from "openai";
import { Books } from "../models/books";

// Gemini client (OpenAI-compatible API). Config comes from env:
//   GEMINI_API_KEY  - API key
//   GEMINI_BASE_URL - e.g. https://generativelanguage.googleapis.com/v1beta/openai/
// Created per call so environment variables are always loaded first.
function getGeminiClient(): OpenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseURL = process.env.GEMINI_BASE_URL;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing");
  if (!baseURL) throw new Error("GEMINI_BASE_URL environment variable is missing");
  return new OpenAI({ apiKey, baseURL });
}

export async function getLibraryChatResponse(userQuery: string): Promise<string> {
  const openai = getGeminiClient();

  // Fetch books directly from MongoDB
  // We select only needed fields (name, author, description) and limit to avoid hitting context limits
  const booksFromDb = await Books.find({})
    .select("name title author description")
    .limit(50)
    .lean();

  // Format the library context
  const libraryContext = booksFromDb.length > 0
    ? booksFromDb.map((b: any) => `- "${b.name || b.title}" by ${b.author}: ${b.description || "No description"}`).join("\n")
    : "No books currently in the library.";

  const systemPrompt = `
    You are a helpful and friendly AI librarian assistant for a user's personal book library dashboard.
    Here is a selection of books currently stored in the user's library database:
    ${libraryContext}

    Instructions:
    - Answer the user's question accurately based on the books listed above.
    - If the user asks something unrelated to books or their library, politely redirect them.
    - Keep answers concise, natural, and helpful.
  `;

  const completion = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });

  return completion.choices[0].message.content || "I couldn't generate a response.";
}

export interface GeneratedBookInfo {
  author?: string;
  description?: string;
}

// Generate an author + description for a book using Gemini (key stays on the server)
export async function generateBookDescription(
  title: string,
  author?: string,
): Promise<GeneratedBookInfo> {
  const openai = getGeminiClient();

  const prompt = `Given the book title "${title}"${author ? ` by ${author}` : ""}, generate a rich,
    engaging, and polished book description (3-4 sentences).

    Respond strictly in JSON format with the following keys:
    {
        "author": "Detected or confirmed author name",
        "description": "Engaging book description"
    }
    `;

  const completion = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content || "{}";
  const parsed = JSON.parse(content) as GeneratedBookInfo;

  return {
    author: typeof parsed.author === "string" ? parsed.author : author,
    description: typeof parsed.description === "string" ? parsed.description : undefined,
  };
}