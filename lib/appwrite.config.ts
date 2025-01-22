import * as sdk from "node-appwrite";

// Extracting environment variables
export const {
  PROJECT_ID,
  API_KEY,
  DB_ID,
  PATIENT_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

// Initialize the Appwrite client
const client = new sdk.Client();

client
  .setEndpoint(ENDPOINT || "https://cloud.appwrite.io/v1") // Use environment variable or fallback
  .setProject(PROJECT_ID || "") // Use environment variable for project ID
  .setKey(API_KEY || ""); // Use environment variable for API key

// Initialize Appwrite services
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
