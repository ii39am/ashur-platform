import React,{createContext,useContext,useEffect,useState} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '../lib/supabase';
import {adminApi,type AdminIdentity} from '../lib/adminApi';
type State='loading'|'signed_out'|'email_unverified'|'mfa_enrollment'|'mfa_challenge'|'checking_admin'|'authorized'|'denied';
interface Value{state:State;session:Session|null;identity:AdminIdentity|null;refresh:()=>Promise<void>;signOut:()=>Promise<void>}
const Context=createContext<Value|null>(null);
export function AdminAuthProvider({children}:{children:React.ReactNode}){const[state,setState]=useState<State>('loading');const[session,setSession]=useState<Session|null>(null);const[identity,setIdentity]=useState<AdminIdentity|null>(null);
 const evaluate=async(next:Session|null)=>{setSession(next);setIdentity(null);if(!next){setState('signed_out');return}if(!next.user.email_confirmed_at){setState('email_unverified');return}const factors=await supabase.auth.mfa.listFactors();const verified=factors.data?.totp?.some((x)=>x.status==='verified');if(!verified){setState('mfa_enrollment');return}const aal=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();if(aal.data?.currentLevel!=='aal2'){setState('mfa_challenge');return}setState('checking_admin');try{setIdentity(await adminApi<AdminIdentity>('admin_me'));setState('authorized')}catch{setState('denied')}};
 useEffect(()=>{let mounted=true;supabase.auth.getSession().then(({data})=>{if(mounted)void evaluate(data.session)});const{data}=supabase.auth.onAuthStateChange((_e,s)=>{if(mounted)void evaluate(s)});return()=>{mounted=false;data.subscription.unsubscribe()}},[]);
 return <Context.Provider value={{state,session,identity,refresh:async()=>evaluate((await supabase.auth.getSession()).data.session),signOut:async()=>{await supabase.auth.signOut();setState('signed_out')}}}>{children}</Context.Provider>}
export const useAdminAuth=()=>{const x=useContext(Context);if(!x)throw new Error('AdminAuthProvider required');return x};
