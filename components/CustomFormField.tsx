"use client";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";

interface CustomProps {
  control: Control<any>,
  fieldtype: FormFieldType,
  name: string,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field: any) => React.ReactNode,
}

const RenderInput = () => {
    return (
        <Input
            type="text"
            placeholder="Enter your name"

        />
    )
}
const CustomFormField = ({ control, fieldtype, name, label }: CustomProps) => {
  return (
    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldtype !== FormFieldType.CHECKBOX && label &&
            (<FormLabel>{label}</FormLabel>

            )}
        <RenderInput field = {field}/>
        </FormItem>
        
      )}
    
      
    />
  );
};

export default CustomFormField;
