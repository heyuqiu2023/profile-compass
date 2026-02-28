import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROFILE_SYSTEM_PROMPT = `You are Lumora AI, a profile writing assistant for university students. When a student describes an experience in rough or informal language, rewrite it as a polished, professional profile entry. Keep it concise — 2-3 sentences max. Do not exaggerate or invent details the student did not mention. If the input is too vague, ask one clarifying question. Format your suggested entry clearly with the title in bold. You can also help improve bios, suggest headlines, recommend skills based on experiences, and write website copy. Always be helpful and concise.`;

const CV_SYSTEM_PROMPT_TEMPLATE = `You are Lumora AI, a CV writing assistant for university students. The user's CV purpose is: {purpose}. Help rewrite experience descriptions to match this purpose. For job applications: use action verbs, quantify impact, keep to 2-3 bullet points. For university applications: emphasise learning, research methodology, intellectual contribution. For social/networking: keep it brief and conversational. Always show a Before and After comparison. Explain briefly why you made the changes. You can also suggest CV structure, recommend which experiences to include, and advise on section ordering.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action, profileData, mode, purpose } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Select system prompt based on mode
    let systemPrompt: string;
    if (mode === "cv") {
      systemPrompt = CV_SYSTEM_PROMPT_TEMPLATE.replace("{purpose}", purpose || "job");
    } else {
      systemPrompt = PROFILE_SYSTEM_PROMPT;
    }

    // Append profile data as context
    if (profileData) {
      systemPrompt += `\n\nHere is the student's current profile data:\n\`\`\`json\n${JSON.stringify(profileData, null, 2)}\n\`\`\`\nUse this data to provide personalised suggestions.`;
    }

    const systemMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Handle quick actions with pre-built prompts
    let userMessages = messages || [];
    if (action && !messages?.length) {
      const bio = profileData?.bio || "(no bio set)";
      const expList = (profileData?.experiences || [])
        .map((e: any) => `- **${e.title}** at ${e.organisation}: ${e.description || "(no description)"}`)
        .join("\n");

      const actionPrompts: Record<string, string> = {
        "improve-bio": `Here is my current bio: "${bio}". Please rewrite it to be more compelling and professional.`,
        "enhance-experiences": `Here are my experiences. Please suggest improvements for each description:\n${expList}`,
        "cv-structure": "Based on my profile, what's the best CV structure for a job application in tech?",
        "website-copy": "Write a compelling About section for my personal portfolio website based on my profile.",
        "headline-ideas": "Suggest 3 professional headlines for my profile based on my background.",
        "suggest-skills": "Based on my experiences, what skills should I add to my profile that I might be missing?",
        "cv-tailor": "Based on my profile, how should I tailor my CV for a tech role? Which experiences should I highlight?",
        "cv-improve": `Here are my experience descriptions. Rewrite each as strong CV bullet points:\n${expList}`,
      };
      userMessages = [{ role: "user", content: actionPrompts[action] || action }];
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [...systemMessages, ...userMessages],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
