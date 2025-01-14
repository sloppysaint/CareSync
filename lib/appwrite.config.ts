import * as sdk from "node-appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DB_ID,
  PATIENT_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject("67856c4500330e742a14") 
  .setKey("standard_1f2bd6cc9e8da356d0fc9ef786586753aa543d196eb447527bbace22ac6e78ee37abae5778713fcdd5a148820523ad759c26a45f18e8be7c87866e7ffc73b5817a1d4620f400195e4fcf07355dad8a2b1fa112f764ad74c6931a20dfcd08979b0c85eeca3ef86285c9329006931082d782491ab7f2117f14699914edec9ed86a"); 

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client); 







