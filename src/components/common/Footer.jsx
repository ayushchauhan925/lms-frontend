import { useState } from "react";
import {
  Linkedin, Youtube, Twitter, Instagram,
  GraduationCap, Send, Mail
} from "lucide-react";

const FooterLink = ({ href = "#", children }) => (
  <li>
    <a
      href={href}
      className="text-slate-400 hover:text-white text-xs transition-colors duration-200 hover:underline underline-offset-4"
    >
      {children}
    </a>
  </li>
);

const SocialIcon = ({ href = "#", label, icon: IconComponent }) => (
  <a
    href={href}
    aria-label={label}
    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-200 hover:scale-110"
  >
    <IconComponent size={13} />
  </a>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <GraduationCap size={15} className="text-white" />
              </div>
              <span className="text-base font-bold text-white">Learnify</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your go-to platform for structured, career-focused online learning.
            </p>
            <div className="flex items-center gap-2">
              <SocialIcon href="#" label="LinkedIn" icon={Linkedin} />
              <SocialIcon href="#" label="YouTube" icon={Youtube} />
              <SocialIcon href="#" label="Twitter / X" icon={Twitter} />
              <SocialIcon href="#" label="Instagram" icon={Instagram} />
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/faqs">FAQs</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink>Refund Policy</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-3">
              Newsletter
            </h3>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-xs bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20">
                <Send size={12} />
                <span>You're subscribed. Thanks!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <div className="relative flex-1">
                    <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                      className="w-full pl-7 pr-2 py-2 text-xs rounded-l-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-r-lg transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-slate-600 text-xs">No spam, ever.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-6 pt-5">
          <p className="text-center text-slate-500 text-xs">
            © 2026 Learnify. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}