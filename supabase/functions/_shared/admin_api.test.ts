import { assertEquals, assertThrows } from '@std/assert';
import { safeAdminError, validateAdminRequest, validatedAal } from './admin_api.ts';

Deno.test('admin API rejects unknown fields and excessive pages',()=>{
  assertThrows(()=>validateAdminRequest({operation:'admin_me',input:{role:'super_admin'}}));
  assertThrows(()=>validateAdminRequest({operation:'admin_list_users',input:{limit:101}}));
});
Deno.test('PII reveal requires a bounded reason',()=>{
  assertThrows(()=>validateAdminRequest({operation:'admin_reveal_user_pii',input:{userId:'10000000-0000-4000-8000-000000000001',reason:'short'}}));
  assertEquals(validateAdminRequest({operation:'admin_reveal_user_pii',input:{userId:'10000000-0000-4000-8000-000000000001',reason:'Authorized support investigation'}}).operation,'admin_reveal_user_pii');
});
Deno.test('AAL parser does not promote malformed or AAL1 tokens',()=>{
  const token=(payload:unknown)=>`x.${btoa(JSON.stringify(payload)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}.x`;
  assertEquals(validatedAal(token({aal:'aal1'})),'aal1'); assertEquals(validatedAal(token({aal:'aal2'})),'aal2'); assertEquals(validatedAal('bad'),null);
});
Deno.test('errors are sanitized',()=>assertEquals(safeAdminError(new Error('database secret details')), {status:503,code:'operation_unavailable'}));
