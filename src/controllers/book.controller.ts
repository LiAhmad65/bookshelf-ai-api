import { Request, Response } from "express";
import {
  addBookService,
  deleteBookByIdService,
  findBookByIdService,
  getAllBooksService,
  updateBookByIdService,
} from "../services/bookService";

export const addBookController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { body } = req;

  try {
    const result = await addBookService(body);
    if (!result) {
      res.status(400).json({
        success: false,
        message: "Book not added",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book added",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Add book failed",
    });
  }
};

export const getAllBooksController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    // Query paramters for pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllBooksService(search, page, limit);
    if (!result.books || result?.books?.length <= 0) {
      res.status(400).json({
        success: false,
        message: "No books found",
      });
    }
    return res.status(200).json({
      success: true,
      data: result.books,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getBookByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  try {
    const result = await findBookByIdService(id);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Book not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteBookByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  try {
    const isDeleted = await deleteBookByIdService(id);
    if (!isDeleted) {
      return res.status(400).json({
        succes: false,
        message: "Delete book failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateBookByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const result = await updateBookByIdService(id, body);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Book not update failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.messsage || "Internal Server Error",
    });
  }
};
