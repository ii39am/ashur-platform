import { createAdminClient } from '../_shared/admin.ts';
import { adminAllowedOrigin, safeAdminError, validateAdminRequest, validatedAal } from '../_shared/admin_api.ts';
import { bearerToken, readLimitedJson } from '../_shared/http.ts';

const headers=(origin:string|null)=>{const h:Record<string,string>={'Content-Type':'application/json','Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'authorization, apikey, content-type','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};if(origin)h['Access-Control-Allow-Origin']=origin;return h;};
const reply=(origin:string|null,body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:headers(origin)});

Deno.serve(async(request)=>{
  const correlationId=crypto.randomUUID();
  const origin=adminAllowedOrigin(request);
  if(origin===false)return reply(null,{error:'origin_not_allowed',correlationId},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:headers(origin)});
  if(request.method!=='POST')return reply(origin,{error:'method_not_allowed',correlationId},405);
  const token=bearerToken(request);
  if(!token)return reply(origin,{error:'authentication_required',correlationId},401);
  let actorId:string|null=null; let operation='admin.unknown';
  try{
    const admin=createAdminClient();
    const {data:{user},error:userError}=await admin.auth.getUser(token);
    if(userError||!user?.id)return reply(origin,{error:'access_denied',correlationId},403);
    actorId=user.id;
    if(!user.email_confirmed_at){await admin.rpc('admin_record_attempt',{p_actor_id:user.id,p_action:'admin.email_verification_denied',p_target_type:'admin_session',p_target_id:null,p_correlation_id:correlationId,p_result:'denied',p_error_category:'email_unverified'});return reply(origin,{error:'access_denied',correlationId},403);}
    if(validatedAal(token)!=='aal2'){await admin.rpc('admin_record_attempt',{p_actor_id:user.id,p_action:'admin.mfa_denied',p_target_type:'admin_session',p_target_id:null,p_correlation_id:correlationId,p_result:'denied',p_error_category:'mfa_required'});return reply(origin,{error:'mfa_required',correlationId},403);}
    const validated=validateAdminRequest(await readLimitedJson(request,16_384)); operation=validated.operation;
    const input=validated.input; let rpc:string; let args:Record<string,unknown>={p_actor_id:user.id};
    switch(validated.operation){
      case 'admin_me':rpc='admin_get_me';break;
      case 'admin_dashboard_summary':rpc='admin_dashboard_summary';break;
      case 'admin_list_users':rpc='admin_list_users';args={...args,p_limit:input.limit,p_offset:input.offset,p_search:input.search??'',p_sort:input.sort??'created_at',p_direction:input.direction??'desc',p_filter:input.filters};break;
      case 'admin_get_user':rpc='admin_get_user';args={...args,p_user_id:input.userId};break;
      case 'admin_reveal_user_pii':rpc='admin_reveal_user_pii';args={...args,p_user_id:input.userId,p_reason:input.reason,p_correlation_id:correlationId};break;
      case 'admin_add_internal_note':rpc='admin_add_internal_note';args={...args,p_user_id:input.userId,p_body:input.body,p_supersedes:input.supersedesNoteId??null,p_correlation_id:correlationId};break;
      case 'admin_list_outbox':rpc='admin_list_outbox';args={...args,p_limit:input.limit,p_offset:input.offset,p_status:input.status??null};break;
      case 'admin_list_audit_events':rpc='admin_list_audit_events';args={...args,p_limit:input.limit,p_offset:input.offset,p_filters:input.filters,p_security_only:false};break;
      case 'admin_list_security_events':rpc='admin_list_audit_events';args={...args,p_limit:input.limit,p_offset:input.offset,p_filters:input.filters,p_security_only:true};break;
    }
    const {data,error}=await admin.rpc(rpc,args);
    if(error)throw error;
    return reply(origin,{data,environment:Deno.env.get('ADMIN_ENVIRONMENT')??'local',correlationId});
  }catch(error){
    const safe=safeAdminError(error);
    if(actorId){try{const admin=createAdminClient();await admin.rpc('admin_record_attempt',{p_actor_id:actorId,p_action:operation,p_target_type:'admin_api',p_target_id:null,p_correlation_id:correlationId,p_result:safe.status===403?'denied':'failed',p_error_category:safe.code});}catch{/* never expose audit failure */}}
    return reply(origin,{error:safe.code,correlationId},safe.status);
  }
});
