import { Request,Response } from "express";
import { generateBookDescription, getLibraryChatResponse } from "../services/aiChatService";
import { BookDescriptionInput } from "../validations/aiValidation";

interface ChatRequestBody {
  userQuery: string;
}

export async function handleAIChat(req: Request<{}, {}, ChatRequestBody>, res: Response): Promise<void> {
  try {
    const { userQuery } = req.body;

    if (!userQuery) {
      res.status(400).json({ error: "userQuery is required" });
      return;
    }

    const reply = await getLibraryChatResponse(userQuery);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: "Failed to process AI chat request" });
  }
}

// POST /ai/generate-book-description { title, author? } -> { author, description }
export async function handleBookDescription(
  req: Request<{}, {}, BookDescriptionInput>,
  res: Response,
): Promise<void> {
  try {
    const { title, author } = req.body;
    const result = await generateBookDescription(title, author);
    res.status(200).json(result);
  } catch (error) {
    console.error("AI Book Description Error:", error);
    res.status(500).json({ error: "Failed to generate book description" });
  }
}
