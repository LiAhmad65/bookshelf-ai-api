import OpenAI from "openai";
import { Books } from "../models/books";

export async function getLibraryChatResponse(userQuery: string): Promise<string> {
  // Initialize OpenAI client inside the function so environment variables are loaded
  const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

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