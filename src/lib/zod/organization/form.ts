import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
});
