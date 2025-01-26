'use server'

import { APPOINTMENT_COLLECTION_ID, databases, DB_ID } from "../appwrite.config";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) =>{
    try {
        const newAppointment = await databases.createDocument(
            DB_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment,
           
          );
      
          return parseStringify(newAppointment);
    } catch (error) {
        console.error(error);
    }
}