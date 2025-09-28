import { createClient } from "@supabase/supabase-js";

// خواندن متغیرها از فایل .env.local
const supabaseUrl = process.env.NEXT_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY!;

// ایجاد و اکسپورت کردن کلاینت Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
