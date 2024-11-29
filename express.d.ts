// express.d.ts
import { Document } from "mongoose";

// Extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      userId: string | Document["_id"]; // Specify the userId type
    }
  }
}
