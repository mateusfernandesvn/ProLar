/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  ruler?: RegisterOptions;
  maxLength?: number; 
}

export function Input({ type, name, placeholder, register, error, ruler, maxLength }: InputProps) {
  return (
    <div>
      <input 
        className={`w-full border-2 rounded-md h-11 px-2 ${error ? 'border-red-700' : 'border-gray-300'}`}
        placeholder={placeholder} 
        type={type} 
        maxLength={maxLength} 
        {...register(name, ruler)}
        id={name}
      />
      {error && <p className="text-red-700 text-sm">{error}</p>} 
    </div>
  );
}
