import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send, Loader2, Sparkles, FileText, Globe, PenLine, Lightbulb, Zap, Bot,
  User, Check, ArrowDownToLine, X,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/ProfileContext";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
const EXTRACT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-profile-updates`;

const defaultActions = [
  { id: "improve-bio", label: "Improve my bio", icon: PenLine, color: "text-blue-600" },
  { id: "enhance-experiences", label: "Enhance experiences", icon: Sparkles, color: "text-amber-600" },
  { id: "cv-structure", label: "Suggest CV structure", icon: FileText, color: "text-emerald-600" },
  { id: "website-copy", label: "Write website copy", icon: Globe, color: "text-purple-600" },
  { id: "headline-ideas", label: "Generate headlines", icon: Lightbulb, color: "text-rose-600" },
  { id: "suggest-skills", label: "Suggest skills", icon: Zap, color: "text-cyan-600" },
];

const cvActions = [
  { id: "cv-structure", label: "Suggest CV structure", icon: FileText, color: "text-emerald-600" },
  { id: "cv-tailor", label: "Tailor for this role", icon: Zap, color: "text-cyan-600" },
  { id: "cv-improve", label: "Improve bullet points", icon: PenLine, color: "text-blue-600" },
];

const profileActions = [
  { id: "improve-bio", label: "Improve my bio", icon: PenLine, color: "text-blue-600" },
  { id: "enhance-experiences", label: "Enhance experiences", icon: Sparkles, color: "text-amber-600" },
  { id: "headline-ideas", label: "Generate headlines", icon: Lightbulb, color: "text-rose-600" },
  { id: "suggest-skills", label: "Suggest skills", icon: Zap, color: "text-cyan-600" },
];

async function streamChat({
  messages, action, profileData, onDelta, onDone, onError,
}: {
  messages: Msg[]; action?: string; profileData?: any;
  onDelta: (text: string) => void; onDone: () => void; onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, action, profileData }),
  });
  if (!resp.ok) { const d = await resp.json().catch(() => ({})); onError(d.error || `Error ${resp.status}`); return; }
  if (!resp.body) { onError("No response body"); return; }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx); buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") break;
      try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) onDelta(c); }
      catch { buffer = line + "\n" + buffer; break; }
    }
  }
  onDone();
}

type AIContext = "default" | "cv" | "profile";

export function FloatingAIPanel() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: profileData, update: updateProfile } = useProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null);
  const [appliedIdxs, setAppliedIdxs] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const context: AIContext = useMemo(() => {
    if (location.pathname.includes("/cv")) return "cv";
    if (location.pathname.includes("/profile")) return "profile";
    return "default";
  }, [location.pathname]);

  const contextLabel = context === "cv" ? "CV Help" : context === "profile" ? "Profile Help" : "AI Assistant";

  const quickActions = context === "cv" ? cvActions : context === "profile" ? profileActions : defaultActions;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Reset messages when context changes
  useEffect(() => {
    setMessages([]);
    setAppliedIdxs(new Set());
  }, [context]);

  const profileSummary = {
    firstName: profileData.firstName, lastName: profileData.lastName,
    headline: profileData.headline, university: profileData.university,
    course: profileData.course, yearOfStudy: profileData.yearOfStudy,
    bio: profileData.bio, location: profileData.location,
    skills: profileData.skills, interests: profileData.interests,
    experiences: profileData.experiences.map((e) => ({
      title: e.title, organisation: e.organisation, type: e.type,
      isCurrent: e.isCurrent, description: e.description,
    })),
    badges: profileData.badges.map((b) => ({ title: b.title, issuer: b.issuer })),
  };

  const send = async (text: string, action?: string) => {
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(""); setIsLoading(true);
    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };
    await streamChat({
      messages: action ? [] : newMessages, action, profileData: profileSummary,
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: (err) => { toast.error(err); setIsLoading(false); },
    });
  };

  const handleApply = async (msgIdx: number) => {
    const aiMessage = messages[msgIdx];
    if (!aiMessage || aiMessage.role !== "assistant") return;
    setApplyingIdx(msgIdx);
    try {
      const resp = await fetch(EXTRACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ aiResponse: aiMessage.content, currentProfile: profileSummary }),
      });
      if (!resp.ok) { const d = await resp.json().catch(() => ({})); toast.error(d.error || "Failed to extract updates"); return; }
      const { updates, error } = await resp.json();
      if (error || !updates) { toast.error(error || "No applicable updates found."); return; }
      const changes: Partial<typeof profileData> = {}; let cnt = 0;
      if (updates.headline) { changes.headline = updates.headline; cnt++; }
      if (updates.bio) { changes.bio = updates.bio; cnt++; }
      if (updates.skills?.length) { changes.skills = Array.from(new Set([...profileData.skills, ...updates.skills])); cnt++; }
      if (updates.interests?.length) { changes.interests = Array.from(new Set([...profileData.interests, ...updates.interests])); cnt++; }
      if (updates.experience_updates?.length) {
        changes.experiences = profileData.experiences.map((exp) => {
          const m = updates.experience_updates.find((u: any) => u.title.toLowerCase() === exp.title.toLowerCase() || u.organisation.toLowerCase() === exp.organisation.toLowerCase());
          if (m) { cnt++; return { ...exp, description: m.new_description }; }
          return exp;
        });
      }
      if (cnt === 0) { toast.info("No specific updates could be extracted."); return; }
      updateProfile(changes);
      setAppliedIdxs((prev) => new Set(prev).add(msgIdx));
      toast.success(`Applied ${cnt} update${cnt > 1 ? "s" : ""} to your profile!`);
    } catch (err: any) { toast.error(err.message || "Failed to apply"); }
    finally { setApplyingIdx(null); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim() || isLoading) return; send(input.trim()); };
  const handleQuickAction = (action: typeof defaultActions[0]) => { if (isLoading) return; send(action.label, action.id); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-5 z-50 w-14 h-14 rounded-full bg-[#1e3a5f] text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/30"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[400px] bg-background border-l border-border shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{contextLabel}</h3>
                    <p className="text-[10px] text-muted-foreground">Powered by Lumora AI</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
                {isEmpty ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-foreground mb-1">{contextLabel}</h2>
                    <p className="text-muted-foreground text-xs max-w-[280px] mb-6">
                      {context === "cv"
                        ? "I can help you structure, tailor, and improve your CV."
                        : context === "profile"
                        ? "I can improve your bio, headline, and experience descriptions."
                        : "I can help you build a standout CV, write copy, and enhance your profile."
                      }
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-center group"
                        >
                          <action.icon className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-[11px] font-medium text-foreground">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i}>
                        <div className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                          {msg.role === "assistant" && (
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Bot className="w-3.5 h-3.5 text-primary" />
                            </div>
                          )}
                          <div className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                            {msg.role === "assistant" ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : (<p>{msg.content}</p>)}
                          </div>
                          {msg.role === "user" && (
                            <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User className="w-3.5 h-3.5 text-secondary-foreground" />
                            </div>
                          )}
                        </div>
                        {msg.role === "assistant" && !isLoading && (
                          <div className="ml-9 mt-1.5">
                            {appliedIdxs.has(i) ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                                <Check className="w-3 h-3" /> Applied
                              </span>
                            ) : (
                              <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1" onClick={() => handleApply(i)} disabled={applyingIdx !== null}>
                                {applyingIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowDownToLine className="w-3 h-3" />}
                                Apply
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="bg-muted rounded-xl px-3 py-2.5">
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border px-4 py-3 shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                  <Textarea
                    value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Ask anything…" className="min-h-[40px] max-h-24 resize-none text-sm" rows={1}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="flex-shrink-0 h-10 w-10">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
                <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                  AI responses may not always be accurate.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
