import { supabase } from './supabase';
export type AdminRole='super_admin'|'admin'|'support'|'analyst'|'security_viewer';
export interface AdminIdentity {userId:string;role:AdminRole;status:'active';permissions:string[]}
export class AdminApiError extends Error { constructor(public code:string,public correlationId:string){super(code)} }
export async function adminApi<T>(operation:string,input:Record<string,unknown>={}):Promise<T>{
  const {data,error}=await supabase.functions.invoke('admin-api',{method:'POST',body:{operation,input}});
  if(error||data?.error)throw new AdminApiError(data?.error??'operation_unavailable',data?.correlationId??'unavailable');
  return data.data as T;
}
export const pageInput=(params:URLSearchParams)=>({limit:Math.min(100,Math.max(1,Number(params.get('limit'))||25)),offset:Math.max(0,Number(params.get('offset'))||0)});
