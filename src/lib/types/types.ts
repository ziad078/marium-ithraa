import { ReactNode } from "react";
import { StatusCode } from "./enums";

export type SelectData = {
  id: string | number,
  value: string,
  label: string
}


export type ValidationErrors = {
  [key: string]: string[];
};

export type InitialState = {
  message?: string;
  error?: ValidationErrors;
  status?: StatusCode | null;
  formData?: FormData | null;
}

export type CardInfo = {
  isLoading: boolean,
  description: string,
  title: string,
  icon?: ReactNode,
  badage: {
    exist: boolean,
  },
  footer: {
    exist: boolean
  }
}