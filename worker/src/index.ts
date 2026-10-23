interface EmailBinding {
  send(message: {to: string; from: string; subject: string; text: string; replyTo?: string}): Promise<{messageId?:string}>;
}
interface Env {
  EMAIL: EmailBinding;
  EMAIL_FROM: string;
  EMAIL_TO: string;
  CONTACT_WORKER_SECRET: string;
}

type Contact = {name: string; email: string; message: string};

function reply(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'},
  });
}

async function verifySecret(provided: string, expected: string): Promise<boolean> {
  if (!provided || !expected || expected.length < 32) return false;
  const encoder = new TextEncoder();
  const [a,b] = await Promise.all([crypto.subtle.digest('SHA-256', encoder.encode(provided)),crypto.subtle.digest('SHA-256', encoder.encode(expected))]);
  const left = new Uint8Array(a); const right = new Uint8Array(b);
  let diff = 0;
  for (let i=0;i<left.length;i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

function isContact(value: unknown): value is Contact {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return Object.keys(v).length === 3 &&
    typeof v.name === 'string' && v.name.trim().length >= 2 && v.name.length <= 80 &&
    typeof v.email === 'string' && v.email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v.email) &&
    typeof v.message === 'string' && v.message.trim().length >= 10 && v.message.length <= 3000;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return reply(405, {error:'Method not allowed'});
    if (!env.EMAIL || !env.EMAIL_FROM || !env.EMAIL_TO || !env.CONTACT_WORKER_SECRET) return reply(503, {error:'Service unavailable'});
    const authorization = request.headers.get('Authorization') || '';
    const provided = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!await verifySecret(provided, env.CONTACT_WORKER_SECRET)) return reply(401, {error:'Unauthorized'});
    if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return reply(415, {error:'Expected JSON'});
    if (Number(request.headers.get('Content-Length') || '0') > 8000) return reply(413, {error:'Payload too large'});
    let value: unknown;
    try {
      const body = await request.text();
      if (new TextEncoder().encode(body).byteLength > 8000) return reply(413,{error:'Payload too large'});
      value = JSON.parse(body);
    } catch { return reply(400, {error:'Invalid JSON'}); }
    if (!isContact(value)) return reply(400, {error:'Invalid contact fields'});
    const {name,email,message} = value;
    const text = `New portfolio contact message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    try {
      await env.EMAIL.send({
        from:env.EMAIL_FROM,
        to:env.EMAIL_TO,
        subject:'New portfolio contact message',
        text,
        replyTo:email,
      });
      return reply(200, {success:true});
    } catch {
      console.error('Email delivery failed');
      return reply(503, {error:'Email delivery unavailable'});
    }
  },
};
