import { useState } from "react";
import { GraduationCap, Mail, Phone, MapPin, Clock, Send, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import Footer from "@/components/common/Footer";

const ContactCard = ({ icon: Icon, title, value, sub }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
      <Icon size={20} className="text-indigo-600" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const topics = [
  { icon: HelpCircle, label: "General Inquiry" },
  { icon: BookOpen,   label: "Course Support"  },
  { icon: MessageCircle, label: "Billing & Payments" },
  { icon: Mail,       label: "Technical Issue" },
];

const ContactUsPage = () => {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Replace with your actual API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <a href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">Learnify</span>
        </a>
      </header>

      {/* Hero */}
      <div className="bg-indigo-600 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-30" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-800 rounded-full opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-indigo-200 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or need help? We're here for you. Our team typically responds within 24 hours.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <ContactCard icon={Mail}    title="Email Us"      value="support@learnify.com"    sub="We reply within 24 hours" />
          <ContactCard icon={Phone}   title="Call Us"       value="+1 (800) 123-4567"        sub="Mon–Fri, 9am–6pm EST" />
          <ContactCard icon={MapPin}  title="Our Office"    value="San Francisco, CA"         sub="123 Learning Lane, 94105" />
          <ContactCard icon={Clock}   title="Working Hours" value="Mon – Fri"                 sub="9:00 AM – 6:00 PM EST" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left – Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Send us a message</h2>
            <p className="text-slate-400 text-sm mb-6">Fill out the form and we'll get back to you shortly.</p>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <Send size={28} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Message Sent!</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                  className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                  <div className="grid grid-cols-2 gap-2">
                    {topics.map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setForm({ ...form, topic: label })}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition duration-200 ${
                          form.topic === label
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={15} className={form.topic === label ? "text-indigo-500" : "text-slate-400"} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right – FAQ + Social */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Answers</h3>
              <div className="space-y-4">
                {[
                  { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot password?' to receive a reset link." },
                  { q: "Can I get a refund?", a: "Yes, within 7 days of purchase and under 20% course completion. See our Refund Policy." },
                  { q: "How do I become an educator?", a: "Sign up and select 'Educator' as your role. You can start creating courses right away." },
                ].map(({ q, a }) => (
                  <div key={q} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-slate-700 mb-1">{q}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
              <a href="/help" className="block mt-4 text-center text-xs text-indigo-600 font-medium hover:underline">
                View full Help Center →
              </a>
            </div>

            {/* Response time */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-3">⚡ Response Times</h3>
              <div className="space-y-2">
                {[
                  { channel: "Email Support",   time: "Within 24 hours" },
                  { channel: "Phone Support",   time: "Mon–Fri, 9am–6pm" },
                  { channel: "Live Chat",       time: "Coming soon" },
                ].map(({ channel, time }) => (
                  <div key={channel} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{channel}</span>
                    <span className="font-semibold text-indigo-600">{time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUsPage;