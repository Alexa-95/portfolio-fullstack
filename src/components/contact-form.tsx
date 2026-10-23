'use client';
import { useRef, useState, type FormEvent } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export function ContactForm(){
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [message,setMessage]=useState('');
 const [company,setCompany]=useState('');const [token,setToken]=useState('');
 const [loading,setLoading]=useState(false);const [status,setStatus]=useState<'idle'|'success'|'error'>('idle');const [feedback,setFeedback]=useState('');
 const captcha=useRef<TurnstileInstance>(null);
 async function send(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(loading||!token)return;
  setLoading(true);setStatus('idle');setFeedback('');
  try {
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message,company,token})});
   const result: {error?:string;message?:string;success?:boolean}=await response.json();
   if(!response.ok)throw new Error(result.error||'Something went wrong.');
   setStatus('success');setFeedback(result.message||'Your message has been sent.');setName('');setEmail('');setMessage('');setCompany('');
  } catch(error){setStatus('error');setFeedback(error instanceof Error?error.message:'Unable to send. Please try again.');}
  finally {setLoading(false);setToken('');captcha.current?.reset();}
 }
 return <form onSubmit={send} className="contact-form">
  <label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80} placeholder="Jane Doe"/>
  <label htmlFor="contact-email">Your email <span>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254} placeholder="jane@example.com"/>
  <label htmlFor="contact-message">Your message <span>*</span></label><textarea id="contact-message" name="message" value={message} onChange={e=>setMessage(e.target.value)} required minLength={10} maxLength={3000} rows={4} placeholder="Tell me a little about your idea..."/>
  <div className="honeypot" aria-hidden="true"><label htmlFor="contact-company">Leave this field empty</label><input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={e=>setCompany(e.target.value)}/></div>
  {siteKey ? <div className="captcha"><Turnstile ref={captcha} siteKey={siteKey} options={{theme:'light',size:'flexible',action:'contact'}} onSuccess={setToken} onExpire={()=>setToken('')} onError={()=>setToken('')}/></div> : <p className="form-config">Contact form setup is required. Add your Turnstile keys to enable sending.</p>}
  <button type="submit" className="button button-dark form-submit" disabled={loading||!token||!siteKey}>{loading?'Sending…':'Send a little hello'} <ArrowUpRight size={17}/></button>
  <p className="form-privacy">Your message goes directly to my inbox. No marketing, no spam.</p>
  {feedback && <div className={`form-feedback ${status}`} role="status" aria-live="polite">{status==='success'&&<CheckCircle2 size={18}/>} {feedback}</div>}
 </form>
}
