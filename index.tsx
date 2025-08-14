import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Gamepad2, Mail, Phone, MessageCircle, Globe, Camera, Play, Link as LinkIcon, Heart, BarChart3, QrCode } from "lucide-react";

// Config
const CONFIG = {
  name: "Nhat Nguyen",
  tagline: "Let's code together",
  bio: "Backend Developer & MMO Enthusiast. Connect with me across different platforms - let's build something amazing together!",
  avatar: "https://i.pravatar.cc/160?img=12",

  chatLinks: [
    { label: "Telegram", href: "https://t.me/nhatcms", icon: Send, highlight: "MOST USED" },
    { label: "Discord", href: "https://discord.gg/your-server", icon: Gamepad2 },
    { label: "Email", href: "mailto:hello@nhatcms.dev", icon: Mail },
    { label: "WhatsApp", href: "https://wa.me/84901234567", icon: Phone },
    { label: "Signal", href: "https://signal.me/#p/+84901234567", icon: MessageCircle },
  ],

  socialLinks: [
    { label: "Facebook", href: "https://facebook.com/nhatcms", icon: Globe },
    { label: "Instagram", href: "https://instagram.com/nhatcms", icon: Camera },
    { label: "Tiktok", href: "https://tiktok.com/@nhatcms", icon: Play },
    { label: "X (Twitter)", href: "https://x.com/nhatcms", icon: LinkIcon },
  ],

  creditName: "NhatCMS",
  creditUrl: "https://hub.nhatcms.net/",
};

// Card wrapper
const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-gray-200 bg-white text-gray-900 font-sans shadow-xl ${className}`}>{children}</div>
);

// Section title
const SectionTitle = ({ children }) => (
  <div className="text-gray-600 text-sm tracking-wide uppercase mb-3 mt-8 font-semibold">{children}</div>
);

// Link wrapper
const SmartLink = ({ href, className = "", onClick, children }) => (
  <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${className}`}>
    {children}
  </a>
);

// Tile button
const Tile = ({ label, href, Icon, highlight, onClick }) => (
  <SmartLink href={href} onClick={onClick} className="relative group">
    {highlight && (
      <span className="absolute -top-2 left-3 z-10 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white tracking-wider shadow">
        {highlight}
      </span>
    )}
    <div className="h-20 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3 px-5">
      <div className="rounded-xl border border-gray-200 p-2 bg-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-medium">{label}</div>
    </div>
  </SmartLink>
);

export default function ProfileLinkHub() {
  const [clicks, setClicks] = useState({});

  const handleClick = (label) => {
    setClicks((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
  };

  const [lang, setLang] = useState("en");
  const texts = {
    en: { chat: "Chat with me", follow: "Follow me" },
    vi: { chat: "Liên hệ với tôi", follow: "Theo dõi tôi" },
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-xl">
        <Card className="p-8">
          <div className="flex justify-end mb-4 gap-2">
            <button onClick={() => setLang(lang === "en" ? "vi" : "en")} className="text-sm px-3 py-1 rounded-full border border-gray-300 bg-gray-50 hover:bg-gray-100">{lang === "en" ? "Tiếng Việt" : "English"}</button>
            <button onClick={() => alert("Export QR logic here")} className="text-sm px-3 py-1 rounded-full border border-gray-300 bg-gray-50 hover:bg-gray-100 flex items-center gap-1"><QrCode className="h-4 w-4"/>QR</button>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src={CONFIG.avatar} alt={CONFIG.name} className="h-28 w-28 rounded-full border border-gray-200 shadow object-cover" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight">{CONFIG.name}</h1>
            <div className="mt-1 text-blue-600 font-medium">{CONFIG.tagline}</div>
            <p className="mt-4 text-gray-700 leading-relaxed">{CONFIG.bio}</p>
          </div>

          <SectionTitle>{texts[lang].chat}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONFIG.chatLinks.map((l) => (
              <Tile key={l.label} label={`${l.label} (${clicks[l.label] || 0})`} href={l.href} Icon={l.icon} highlight={l.highlight} onClick={() => handleClick(l.label)} />
            ))}
          </div>

          <SectionTitle>{texts[lang].follow}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONFIG.socialLinks.map((l) => (
              <Tile key={l.label} label={`${l.label} (${clicks[l.label] || 0})`} href={l.href} Icon={l.icon} onClick={() => handleClick(l.label)} />
            ))}
          </div>

          <div className="mt-10 text-center text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              © Developed with <Heart className="h-4 w-4" /> by
            </span>{" "}
            <a href={CONFIG.creditUrl} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              {CONFIG.creditName}
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
