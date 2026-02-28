import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Layer AI, a friendly and expert career assistant for university students. You help students build compelling CVs, personal websites, and profile descriptions.

Your capabilities:
1. **CV Suggestions**: Suggest improvements to experience descriptions, recommend structure, highlight achievements with metrics, and write professional bullet points.
2. **Website Copy**: Write engaging bio text, headlines, and about sections for personal portfolio websites.
3. **Experience Enhancement**: Take basic experience descriptions and make them more compelling with action verbs, quantified impact, and clear outcomes.
4. **Skills & Interests**: Suggest relevant skills and interests based on the student's background.
5. **General Career Advice**: Help with positioning, personal branding, and making the most of university experiences.

Guidelines:
- Keep responses concise and actionable
- Use bullet points for CV suggestions
- When enhancing descriptions, provide the improved version directly
- Be encouraging but honest
- Focus on the UK university context
- Use markdown formatting for clear structure
- When the user shares their profile data, reference it specifically in your suggestions`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action, profileData } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware messages
    const systemMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // If profile data is provided, add it as context
    if (profileData) {
      systemMessages.push({
        role: "system",
        content: `Here is the student's current profile data:\n\`\`\`json\n${JSON.stringify(profileData, null, 2)}\n\`\`\`\nUse this data to provide personalised suggestions.`,
      });
    }

    // Handle quick actions with pre-built prompts
    let userMessages = messages || [];
    if (action && !messages?.length) {
      const actionPrompts: Record<string, string> = {
        "improve-bio": "Review my bio and suggest 2-3 improved versions that are more compelling and professional. Keep them concise (under 300 characters).",
        "enhance-experiences": "Review each of my experiences and rewrite the descriptions with stronger action verbs, quantified impact, and clearer outcomes. Format as bullet points.",
        "suggest-skills": "Based on my experiences and background, suggest 5-10 additional relevant skills I should add to my profile.",
        "cv-structure": "Suggest the best CV structure and section ordering for my profile. Include tips on what to emphasise and what to add.",
        "website-copy": "Write compelling website copy for my personal portfolio, including a hero headline, about section, and a brief tagline.",
        "headline-ideas": "Generate 5 alternative headlines for my profile that are catchy, professional, and highlight my strengths.",
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
