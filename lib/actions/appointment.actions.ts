'use server'

import { APPOINTMENT_COLLECTION_ID, databases, DB_ID } from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

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

export const getAppointment = async (appointmentId: string) =>{
    try {
        const appointment = await databases.getDocument(
            DB_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
          
        )
        return parseStringify(appointment);
    } catch (error) {
        console.log(error)
    }
}

export const getRecentAppointmentsList = async () =>{
    try {
        const appointments = await databases.listDocuments(
            DB_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        )
        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) =>{
            if(appointment.status === 'scheduled'){
                acc.scheduledCount++;
            }
            else if(appointment.status === 'pending'){
                acc.pendingCount++;
            }
            else if(appointment.status === 'cancelled'){
                acc.cancelledCount++;
            }
            return acc;
        },initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        return parseStringify(data);
    } catch (error) {
        console.log(error)
    }
}