import { createClient } from '@supabase/supabase-js';
import { readConfig } from '../config';
const config=readConfig();
export const supabase=createClient(config.supabaseUrl,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
export { config };
