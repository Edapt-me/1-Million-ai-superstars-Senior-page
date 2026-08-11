import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSettings() {
  const { data, error } = await supabase.from('website_settings').select('*').eq('id', 1).single();
  if (error) console.error(error);
  else {
    console.log("HERO TITLE:", JSON.stringify(data.hero_title));
    console.log("HERO SUBTITLE:", JSON.stringify(data.hero_subtitle));
  }
}

checkSettings();
