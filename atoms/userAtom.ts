// atoms/userAtom.ts
import { UserData } from "@/components/sidebar/app-sidebar";
import { atom } from "jotai";

export const userAtom = atom<UserData | null>(null);
