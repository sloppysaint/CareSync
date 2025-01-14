

import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  // Validate the phone number format
  const phoneRegex = /^\+\d{1,15}$/;
  if (!phoneRegex.test(user.phone)) {
    throw new Error("Invalid phone number. It must start with '+' and contain up to 15 digits.");
  }
  console.log(user.phone)
  try {
    const newUser = await users.create(
      ID.unique(), // Generate a unique user ID
      user.email,
      user.phone,   // User's phone  // User's email
      undefined,
      user.name,   // User's name

    );
    console.log(newUser)
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      // Handle duplicate user case
      const documents = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return documents?.users[0]; // Return existing user
    }
    throw error; // Rethrow other errors
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error)
  }
}
