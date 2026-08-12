export const adminOperations = ['admin_me','admin_dashboard_summary','admin_list_users','admin_get_user','admin_reveal_user_pii','admin_add_internal_note','admin_list_outbox','admin_list_audit_events','admin_list_security_events'] as const;
export type AdminOperation = typeof adminOperations[number];

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const exact = (value: Record<string, unknown>, allowed: string[]) => Object.keys(value).every((key) => allowed.includes(key));
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid_request');
  return value as Record<string, unknown>;
};
const boundedInt = (value: unknown, fallback: number, min: number, max: number) => {
  if (value === undefined) return fallback;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) throw new Error('invalid_request');
  return value;
};
const id = (value: unknown) => { if (typeof value !== 'string' || !uuid.test(value)) throw new Error('invalid_request'); return value; };

export interface ValidatedAdminRequest { operation: AdminOperation; input: Record<string, unknown> }

export function validateAdminRequest(raw: unknown): ValidatedAdminRequest {
  const body = object(raw);
  if (!exact(body, ['operation','input']) || typeof body.operation !== 'string' || !adminOperations.includes(body.operation as AdminOperation)) throw new Error('invalid_request');
  const operation = body.operation as AdminOperation;
  const input = object(body.input ?? {});
  if (operation === 'admin_me' || operation === 'admin_dashboard_summary') {
    if (!exact(input, [])) throw new Error('invalid_request');
  } else if (operation === 'admin_list_users') {
    if (!exact(input,['limit','offset','search','sort','direction','filters'])) throw new Error('invalid_request');
    input.limit=boundedInt(input.limit,25,1,100); input.offset=boundedInt(input.offset,0,0,100000);
    if (input.search !== undefined && (typeof input.search !== 'string' || input.search.length>160)) throw new Error('invalid_request');
    if (input.sort !== undefined && !['created_at','full_name','email_verified','preferred_language'].includes(String(input.sort))) throw new Error('invalid_request');
    if (input.direction !== undefined && !['asc','desc'].includes(String(input.direction))) throw new Error('invalid_request');
    const filters=object(input.filters ?? {}); if(!exact(filters,['verified','profileCompleted','language','ownsBusiness'])) throw new Error('invalid_request'); input.filters=filters;
  } else if (operation === 'admin_get_user') {
    if (!exact(input,['userId'])) throw new Error('invalid_request'); input.userId=id(input.userId);
  } else if (operation === 'admin_reveal_user_pii') {
    if (!exact(input,['userId','reason'])) throw new Error('invalid_request'); input.userId=id(input.userId);
    if(typeof input.reason!=='string'||input.reason.trim().length<10||input.reason.trim().length>500) throw new Error('invalid_request'); input.reason=input.reason.trim();
  } else if (operation === 'admin_add_internal_note') {
    if (!exact(input,['userId','body','supersedesNoteId'])) throw new Error('invalid_request'); input.userId=id(input.userId);
    if(typeof input.body!=='string'||input.body.trim().length<2||input.body.trim().length>2000) throw new Error('invalid_request'); input.body=input.body.trim();
    if(input.supersedesNoteId!==undefined&&input.supersedesNoteId!==null) input.supersedesNoteId=id(input.supersedesNoteId);
  } else if (operation === 'admin_list_outbox') {
    if (!exact(input,['limit','offset','status'])) throw new Error('invalid_request'); input.limit=boundedInt(input.limit,25,1,100); input.offset=boundedInt(input.offset,0,0,100000);
    if(input.status!==undefined&&input.status!==null&&!['pending','claimed','sending','failed','reconciliation_required','sent'].includes(String(input.status))) throw new Error('invalid_request');
  } else {
    if (!exact(input,['limit','offset','filters'])) throw new Error('invalid_request'); input.limit=boundedInt(input.limit,25,1,100); input.offset=boundedInt(input.offset,0,0,100000);
    const filters=object(input.filters ?? {}); if(!exact(filters,['actorId','action','result','targetType','correlationId','from','to'])) throw new Error('invalid_request'); input.filters=filters;
  }
  return { operation, input };
}

export function adminAllowedOrigin(request: Request) {
  const origin=request.headers.get('Origin');
  const environment=Deno.env.get('ADMIN_ENVIRONMENT') ?? 'local';
  const configured=Deno.env.get('ADMIN_ALLOWED_ORIGIN') ?? '';
  if (!origin) return null;
  if (configured && configured !== '*' && origin === configured) return origin;
  if (environment==='local' && Deno.env.get('ALLOW_LOCALHOST_ADMIN_ORIGINS')==='true' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(origin)) return origin;
  return false;
}

export function validatedAal(token: string) {
  try {
    const part=token.split('.')[1]; if(!part) return null;
    const normalized=part.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(part.length/4)*4,'=');
    const claims=JSON.parse(atob(normalized));
    return claims?.aal === 'aal2' ? 'aal2' : claims?.aal === 'aal1' ? 'aal1' : null;
  } catch { return null; }
}

export function safeAdminError(error: unknown) {
  const message=error && typeof error==='object' && 'message' in error ? String((error as {message:unknown}).message) : '';
  if(message.includes('admin_permission_denied')) return {status:403,code:'access_denied'};
  if(message.includes('user_not_found')) return {status:404,code:'not_found'};
  if(message.includes('invalid_')) return {status:400,code:'invalid_request'};
  return {status:503,code:'operation_unavailable'};
}
