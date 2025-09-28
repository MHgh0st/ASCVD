import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

export enum QuitDuration {
  LESS_THAN_ONE_MONTH = "کمتر از یک ماه",
  LESS_THAN_SIX_MONTHS = "کمتر از 6 ماه",
  MORE_THAN_SIX_MONTHS = "بیشتر از 6 ماه",
}

export type AscvdData = {
  age: number;
  cholesterol: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  HDLCholesterol: number;
  LDLCholesterol: number;
  sex: "male" | "female";
  diabetes: "yes" | "no";
  smoke: "yes" | "no" | "former";
  quitDuration?: QuitDuration;
  bloodPreasureMedicine: "yes" | "no";
};

export type RiskType = "low" | "borderline" | "intermediate" | "high";
export type AscvdResult = {
  final_risk: number;
  risk_category: RiskType;
};

export type RegisterFormData = {
  name: string;
  phone: string;
  password: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    phone: string;
  }
}

export interface User {
  id: string;
  name?: string | null;
  phone: string;
}
