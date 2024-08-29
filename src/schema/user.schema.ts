import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.coerce.number({ invalid_type_error: "ID must be a number.", required_error: "ID is required." }),
    username: z
      .string({ invalid_type_error: "Username must be a string.", required_error: "Username is required." })
      .max(100, { message: "Username is too long. Please enter no more than 100 characters." })
      .min(3, { message: "Username must be at least 3 characters." }),
    password: z
      .string({ invalid_type_error: "Password must be a string.", required_error: "Password is required." })
      .min(8, "Password must be at least 8 characters."),
    profile: z.object(
      {
        address: z
          .string({ invalid_type_error: "Address must be a string." })
          .max(100, { message: "Address is too long. Please enter no more than 100 characters." })
          .optional(),
        name: z
          .string({ invalid_type_error: "Name must be a string.", required_error: "Name is required." })
          .max(100, { message: "Name is too long. Please enter no more than 100 characters." })
          .min(1, { message: "Name is not allowed to be empty." }),
        avatar: z
          .string({ invalid_type_error: "Avatar must be a string." })
          .max(100, { message: "Avatar url is too long. Please enter no more than 100 characters." })
          .default("avatar-default.jpg"),
      },
      { invalid_type_error: "Profile must be an object '{ name: string }'.", required_error: "Profile is required." },
    ),
    phonenumber: z
      .object(
        {
          number: z
            .string({ invalid_type_error: "Phone number must be a string.", required_error: "Phone number is required." })
            .min(10, { message: "Phone number must be at least 10 characters." })
            .max(25, { message: "Phone number is too long. Please enter no more than 25 characters." }),
          countryCode: z
            .string({ invalid_type_error: "Country code must be a string.", required_error: "Country code is required." })
            .min(1, { message: "Country code is not allowed to be empty." })
            .max(2, {
              message:
                "Country code is too long. Country codes are two-letter e.g. IN, DO, NE, SI, AE. See https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 for more information.",
            })
            .default("ID"),
        },
        { invalid_type_error: "Phonenumber must be an object '{ number: string }'.", required_error: "Phonenumber is required." },
      )

      .superRefine((data, ctx) => {
        if (!isValidPhoneNumber(data.number, data.countryCode.toUpperCase() as CountryCode)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phonenumber is invalid.", path: ["number"] });
        }
      }),

    //phonenumber String          @db.VarChar(100)
    //profile     Profile?
    //cart        Cart?
    //reviews     Review[]
    //likes       LikeOnProduct[]
    //orders      Order[]
  })
  .partial();

export const UserRegisterSchema = UserSchema.required({
  username: true,
  password: true,
  profile: true,
  phonenumber: true,
});

export const UserLoginSchema = z.object({
  username: z
    .string({ invalid_type_error: "Username must be a string.", required_error: "Username is required." })
    .min(1, { message: "Username is not allowed to be empty." }),
  password: z
    .string({ invalid_type_error: "Password must be a string.", required_error: "Password is required." })
    .min(1, { message: "Password is not allowed to be empty." }),
});
