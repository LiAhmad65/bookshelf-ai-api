import { Request, Response } from "express";
import { Books, IBook, IBooksDocument } from "../models/books";
import { AddBookSchema } from "../validations/bookValidation";
import { cache } from "../utils/cache";

export const addBookService = async (
  payload: AddBookSchema,
): Promise<IBook> => {
  const newBook = new Books(payload);

  // 1. First save new book in DB
  const savedBook = await newBook.save() 

  // 2. After successfull clear the cache
  cache.flushAll()

  return savedBook;
};

export const getAllBooksService = async (
  search?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ books: IBooksDocument[]; total: number }> => {
  const skip = (page - 1) * limit;

  // 1. Create unique key for cache
  const cacheKey = `books_${search || "all"}_p${page}_l${limit}`

  // 2. Check if data already available in cache
  if(cache.has(cacheKey)){
    console.log("Serving from Cache 🚀");
    return cache.get(cacheKey) as {books: IBooksDocument[]; total:number}
  }

  // 3. else get data directly from DB

  let query = {};
  if (search && typeof search === "string") {
    query = {
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };
  }

  // Optimization technique
  const [books, total] = await Promise.all([
    Books.find(query).skip(skip).limit(limit).lean(),
    Books.countDocuments(query)
  ])

  // Find data from DB using skip and limit methods
  // const books = await Books.find(query).skip(skip).limit(limit);

  // // Count total so FE can know total page count
  // const total = await Books.countDocuments(query);

  // return books and total
  const result = { books, total };

  // 4. Save the response to cache
  cache.set(cacheKey, result)
  console.log("Serving from Database 💾");
  return result
};

export const findBookByIdService = async (id: string): Promise<IBook> => {
  const book = await Books.findOne({ _id: id });
  if (!book) {
    throw new Error("Book not found");
  }
  return book;
};

export const deleteBookByIdService = async (id: string): Promise<any> => {
  if (!id) {
    throw new Error("Id required");
  }
  return Books.findOneAndDelete({ _id: id });
};

export const updateBookByIdService = async (
  id: string,
  payload: AddBookSchema,
): Promise<IBook> => {
  if (!id) {
    throw new Error("Id required");
  }
  if (!payload) {
    throw new Error("Body required");
  }
  const updatedBook = await Books.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedBook) {
    throw new Error("Book not found");
  }
  return updatedBook;
};
