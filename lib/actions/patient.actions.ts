import { ID, Query } from "node-appwrite";
import { BUCKET_ID, databases, DB_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import {InputFile} from "node-appwrite/file"
export const createUser = async (user: CreateUserParams) => {
  // Validate the phone number format
  const phoneRegex = /^\+\d{1,15}$/;
  if (!phoneRegex.test(user.phone)) {
    throw new Error(
      "Invalid phone number. It must start with '+' and contain up to 15 digits."
    );
  }
  console.log(user.phone);
  try {
    const newUser = await users.create(
      ID.unique(), // Generate a unique user ID
      user.email,
      user.phone, // User's phone  // User's email
      undefined,
      user.name // User's name
    );
    console.log(newUser);
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      // Handle duplicate user case
      const documents = await users.list([Query.equal("email", [user.email])]);
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
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('filename') as string,
      )
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    const newPatient = await databases.createDocument(
      
      DB_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project = ${PROJECT_ID}`,
        ...patient
      }
    )
    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
  }
};
