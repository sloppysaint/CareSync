"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import {
  BUCKET_ID,
  DB_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.Emaill,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.Emaill]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DB_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};
//GET PATIENT
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};
// REGISTER PATIENT
export const registerPatient = async ({
  userId,
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    let identificationDocumentUrl = null;

    if (identificationDocument) {
      // Extract values from FormData
      const blobFile = identificationDocument.get("blobFile") as File; // `get` returns the value of the specified key
      const fileName = blobFile?.name; // Get the file name from the `File` object

      if (blobFile && fileName) {
        // Convert File object to InputFile
        const arrayBuffer = await blobFile.arrayBuffer();
        const inputFile = InputFile.fromBuffer(
          Buffer.from(arrayBuffer),
          fileName
        );

        // Upload file
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);

        // Generate file URL
        identificationDocumentUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`;
      } else {
        console.error("Invalid identificationDocument provided.");
      }
    }

    // Create new patient record
    const newPatient = await databases.createDocument(
      DB_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl:
          identificationDocumentUrl || "No document provided", // Fallback for optional fields
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw error;
  }
};
