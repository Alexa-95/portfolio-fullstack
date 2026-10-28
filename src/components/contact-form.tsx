"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { buttonDark, mono } from "@/lib/styles";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const label = "mt-[17px] mb-2 text-sm font-bold text-plum-muted";
const field =
  "w-full rounded-none border-b border-line-rose bg-transparent px-px pt-2.5 pb-3.5 text-md text-plum-soft outline-0 placeholder:text-taupe-light focus:border-b-2 focus:border-wine";
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const captcha = useRef<TurnstileInstance>(null);
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !token) return;
    // Mirror the server rules (it trims and requires a domain with a dot).
    if (name.trim().length < 2) {
      setStatus("error");
      setFeedback("Please enter your name (at least 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus("error");
      setFeedback("Please enter a valid email address, e.g. jane@example.com.");
      return;
    }
    if (message.trim().length < 10) {
      setStatus("error");
      setFeedback("Your message should be at least 10 characters long.");
      return;
    }
    setLoading(true);
    setStatus("idle");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim(),
          message,
          company,
          token,
          elapsed: Date.now() - shownAt.current,
        }),
      });
      const result: { error?: string; message?: string; success?: boolean } =
        await response.json();
      if (!response.ok)
        throw new Error(result.error || "Something went wrong.");
      setStatus("success");
      setFeedback(result.message || "Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
      setCompany("");
      shownAt.current = Date.now();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to send. Please try again.",
      );
    } finally {
      setLoading(false);
      setToken("");
      captcha.current?.reset();
    }
  }
  return (
    <form onSubmit={send} className="flex flex-col pt-5">
      <label htmlFor="contact-name" className={label}>
        Your name <span className="text-rose-dark">*</span>
      </label>
      <input
        id="contact-name"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={80}
        placeholder="Jane Doe"
        className={field}
      />
      <label htmlFor="contact-email" className={label}>
        Your email <span className="text-rose-dark">*</span>
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        maxLength={254}
        placeholder="jane@example.com"
        className={field}
      />
      <label htmlFor="contact-message" className={label}>
        Your message <span className="text-rose-dark">*</span>
      </label>
      <textarea
        id="contact-message"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        minLength={10}
        maxLength={3000}
        rows={4}
        placeholder="Tell me a little about your idea..."
        className={`${field} resize-y`}
      />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-hp">Leave this field empty</label>
        {/* Not named "company": browsers autofill that from saved profiles. */}
        <input
          id="contact-hp"
          name="hp_field"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      {siteKey ? (
        <div className="mt-6 min-h-[55px]">
          <Turnstile
            ref={captcha}
            siteKey={siteKey}
            options={{ theme: "light", size: "flexible", action: "contact" }}
            onSuccess={setToken}
            onExpire={() => setToken("")}
            onError={() => setToken("")}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-error">
          Contact form setup is required. Add your Turnstile keys to enable
          sending.
        </p>
      )}
      <button
        type="submit"
        className={`${buttonDark} mt-6 w-full justify-between`}
        disabled={loading || !token || !siteKey}
      >
        {loading ? "Sending…" : "Send a little hello"}{" "}
        <ArrowUpRight size={17} />
      </button>
      <p
        className={`${mono} mt-[18px] text-center text-3xs leading-[1.7] text-taupe-gray`}
      >
        Your message goes directly to my inbox. No marketing, no spam.
      </p>
      {feedback && (
        <div
          className={`mt-3.5 flex items-center gap-[7px] p-3 text-sm leading-[1.6] ${status === "success" ? "bg-success-bg text-success" : "bg-error-bg text-error"}`}
          role="status"
          aria-live="polite"
        >
          {status === "success" && <CheckCircle2 size={18} />} {feedback}
        </div>
      )}
    </form>
  );
}
