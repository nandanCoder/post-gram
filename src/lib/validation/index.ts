import * as z from "zod";

export const signupValidation = z.object({
  name: z.string().min(4, { message: "To short" }),
  username: z.string().min(2, { message: "Too short" }).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" }),
});
export const signinValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" }),
});
export const postValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Caption must be at last five characters" })
    .max(2200),
  file: z.custom<File[]>(), // get your owen cusstom type
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters" })
    .max(100),
  tags: z.string(),
});
