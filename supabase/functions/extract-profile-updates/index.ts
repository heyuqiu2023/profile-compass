import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { aiResponse, currentProfile } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a data extraction assistant. Given an AI assistant's response that contains profile improvement suggestions, extract the concrete changes that should be applied to the user's profile. Only extract fields that have clear, specific new values suggested. Do not make up data the AI didn't suggest.

Current profile data:
\`\`\`json
${JSON.stringify(currentProfile, null, 2)}
\`\`\``,
          },
          {
            role: "user",
            content: `Extract the profile updates from this AI response:\n\n${aiResponse}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "apply_profile_updates",
              description: "Apply extracted profile updates. Only include fields that have specific new values suggested by the AI.",
              parameters: {
                type: "object",
                properties: {
                  headline: { type: "string", description: "New headline if suggested" },
                  bio: { type: "string", description: "New bio if suggested" },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Updated skills list if suggested (merged with existing)",
                  },
                  interests: {
                    type: "array",
                    items: { type: "string" },
                    description: "Updated interests list if suggested",
                  },
                  experience_updates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Experience title to match" },
                        organisation: { type: "string", description: "Organisation to match" },
                        new_description: { type: "string", description: "Enhanced description" },
                      },
                      required: ["title", "organisation", "new_description"],
                      additionalProperties: false,
                    },
                    description: "Updated experience descriptions if suggested",
                  },
                },
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "apply_profile_updates" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Failed to extract updates" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "No updates could be extracted" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const updates = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ updates }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-profile-updates error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
