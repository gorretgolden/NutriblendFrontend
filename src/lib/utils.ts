import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compareArrays = (a?: any[], b?: any[]) => {
  const arrA = a ?? [];
  const arrB = b ?? [];
  return arrA.toString() === arrB.toString();
};

