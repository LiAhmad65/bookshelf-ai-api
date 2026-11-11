import { Request,Response } from "express";
import { getLibraryChatResponse} from "../services/aiChatService";

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