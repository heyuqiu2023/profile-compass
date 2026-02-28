import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Loader2,
  Sparkles,
  FileText,
  Globe,
  PenLine,
  Lightbulb,
  Zap,
  Bot,
  User,
  Check,
  ArrowDownToLine,
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/contexts/ProfileContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
const EXTRACT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-profile-updates`;

const quickActions = [
  { id: "improve-bio", label: "Improve my bio", icon: PenLine, color: "text-blue-600" },
  { id: "enhance-experiences", label: "Enhance experiences", icon: Sparkles, color: "text-amber-600" },
  { id: "cv-structure", label: "Suggest CV structure", icon: FileText, color: "text-emerald-600" },
  { id: "website-copy", label: "Write website copy", icon: Globe, color: "text-purple-600" },
  { id: "headline-ideas", label: "Generate headlines", icon: Lightbulb, color: "text-rose-600" },
  { id: "suggest-skills", label: "Suggest skills", icon: Zap, color: "text-cyan-600" },
];

async function streamChat({
  messages,
  action,
  profileData,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  action?: string;
  profileData?: any;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, action, profileData }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) {
    onError("No response body");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

const AIAssistant = () => {
  const { data: profileData, update: updateProfile } = useProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null);
  const [appliedIdxs, setAppliedIdxs] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Build a slim profile summary for AI context
  const profileSummary = {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    headline: profileData.headline,
    university: profileData.university,
    course: profileData.course,
    yearOfStudy: profileData.yearOfStudy,
    bio: profileData.bio,
    location: profileData.location,
    skills: profileData.skills,
    interests: profileData.interests,
    experiences: profileData.experiences.map((e) => ({
      title: e.title,
      organisation: e.organisation,
      type: e.type,
      isCurrent: e.isCurrent,
      description: e.description,
    })),
    badges: profileData.badges.map((b) => ({
      title: b.title,
      issuer: b.issuer,
    })),
  };

  const send = async (text: string, action?: string) => {
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: action ? [] : newMessages,
      action,
      profileData: profileSummary,
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: (err) => {
        toast.error(err);
        setIsLoading(false);
      },
    });
  };

  const handleApply = async (msgIdx: number) => {
    const aiMessage = messages[msgIdx];
    if (!aiMessage || aiMessage.role !== "assistant") return;

    setApplyingIdx(msgIdx);
    try {
      const resp = await fetch(EXTRACT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          aiResponse: aiMessage.content,
          currentProfile: profileSummary,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        toast.error(data.error || "Failed to extract updates");
        return;
      }

      const { updates, error } = await resp.json();
      if (error || !updates) {
        toast.error(error || "No applicable updates found in this response.");
        return;
      }

      // Apply updates to profile
      const changes: Partial<typeof profileData> = {};
      let changeCount = 0;

      if (updates.headline) {
        changes.headline = updates.headline;
        changeCount++;
      }
      if (updates.bio) {
        changes.bio = updates.bio;
        changeCount++;
      }
      if (updates.skills?.length) {
        const merged = Array.from(new Set([...profileData.skills, ...updates.skills]));
        changes.skills = merged;
        changeCount++;
      }
      if (updates.interests?.length) {
        const merged = Array.from(new Set([...profileData.interests, ...updates.interests]));
        changes.interests = merged;
        changeCount++;
      }
      if (updates.experience_updates?.length) {
        const updatedExps = profileData.experiences.map((exp) => {
          const match = updates.experience_updates.find(
            (u: any) =>
              u.title.toLowerCase() === exp.title.toLowerCase() ||
              u.organisation.toLowerCase() === exp.organisation.toLowerCase()
          );
          if (match) {
            changeCount++;
            return { ...exp, description: match.new_description };
          }
          return exp;
        });
        changes.experiences = updatedExps;
      }

      if (changeCount === 0) {
        toast.info("No specific updates could be extracted from this response.");
        return;
      }

      updateProfile(changes);
      setAppliedIdxs((prev) => new Set(prev).add(msgIdx));
      toast.success(`Applied ${changeCount} update${changeCount > 1 ? "s" : ""} to your profile!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to apply updates");
    } finally {
      setApplyingIdx(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input.trim());
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (isLoading) return;
    send(action.label, action.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-3xl mx-auto">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">Lumora AI Assistant</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-8">
              I can help you build a standout CV, write website copy, and enhance your
              profile descriptions. Try a quick action below or ask me anything.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-center group"
                >
                  <action.icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
                {/* Apply button for assistant messages */}
                {msg.role === "assistant" && !isLoading && (
                  <div className="ml-11 mt-2">
                    {appliedIdxs.has(i) ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <Check className="w-3.5 h-3.5" /> Applied to profile
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => handleApply(i)}
                        disabled={applyingIdx !== null}
                      >
                        {applyingIdx === i ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                        )}
                        Apply to Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-4 md:px-8 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-3xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about CV tips, website copy, or how to improve your profile…"
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="flex-shrink-0">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          AI responses may not always be accurate. Review suggestions before using them.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
