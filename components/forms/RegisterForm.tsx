"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/Validation";
import { useRouter } from "next/navigation";

import { registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem  } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      Emaill: "",
      phone: "",
      gender: "male" as const,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    console.log("loading started");
    setIsLoading(true);
    let formData;
  
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
  
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
  
      console.log("Submitting patient data:", patientData);
      // @ts-ignore
      const patient = await registerPatient(patientData);
      console.log("Patient response:", patient);
  
      if (patient) {
        console.log("Redirecting to:", `/patients/${user.$id}/new-appointment`);
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldtype={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Joe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="Emaill"
            label="Email"
            placeholder="joe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldtype={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="+1 123-456-7890"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
          />
          <CustomFormField
            fieldtype={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(
              field // Correctly destructure and use parentheses for JSX
            ) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value} 
                >
                  {GenderOptions.map((option,i) => (
                    <div
                      key={option + i}
                      className="flex items-center space-x-2 radio-group"
                    >
                      <RadioGroupItem
                        value={option}
                        id={option}
                        className="w-4 h-4 rounded-full border border-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      />
                      <Label  htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="273, G&JU Block, Pitampura"
          />
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's Name"
          />
          <CustomFormField
            fieldtype={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="EmergencyContactNumber" // Matches the schema
            label="Emergency Contact"
            placeholder="+91 123-456-7890"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldtype={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a Physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="ACKO"
          />
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Inbox Policy Number"
            placeholder="ABC1324354"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)" 
            placeholder="pollen, peanuts, penicillin"
          />
          <CustomFormField
            fieldtype={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Paracetamol 500mg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldtype={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History" 
            placeholder="Mother had heart disease and father had arithritis"
          />
          <CustomFormField
            fieldtype={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalhistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldtype={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
            fieldtype={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Indentification Number"
            placeholder="1233245"
          />

          <CustomFormField
            fieldtype={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(
              field 
            ) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
          />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          fieldtype={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          fieldtype={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldtype={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;