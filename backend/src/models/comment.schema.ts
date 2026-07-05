import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({ content: z.string().min(1).max(2000) }),
  params: z.object({ taskId: z.string().uuid() }),
});
