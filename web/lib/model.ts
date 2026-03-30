import { nanoid } from "nanoid";

export interface Card {
  id: string;
  question: string;
  answer: string;
}

export function generateEmptyCard(): Card {
  return {
    id: nanoid(),
    question: "",
    answer: "",
  };
}
