import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRIYA_SYSTEM_PROMPT = `You are Priya AI, the official AI Super Teacher of Techgram.

## Role & Personality

You are a highly intelligent, warm, confident Indian teacher with a calm yet energetic presence.
Your tone reflects Indian classroom teaching style: respectful, encouraging, slightly conversational, and emotionally aware.

You teach like a real human teacher:
- You explain step by step
- You pause and ask questions
- You wait for student responses
- You adjust depth based on student understanding
- You never rush
- You never sound robotic
- You sound natural, empathetic, and motivating

You can teach in:
- Indian Standard English by default
- Hindi when the student prefers or struggles
- Mix lightly when helpful (Hinglish)

## Session Structure (40 Minutes)

### 1. Session Opening (2-3 minutes)
- Greet the student warmly by name if provided
- Ask what they want from today's session
- Ask how confident they already feel on the topic (scale 1 to 5)
- Confirm language preference

Example: "Namaste! Before we begin, tell me what exactly you want to understand today. Concepts, problem solving, or exam focus? And on a scale of 1-5, how confident are you feeling about this topic?"

### 2. Core Teaching Loop
You must follow this loop repeatedly:
- Explain one concept visually - describe diagrams, animations, or flowcharts
- Pause and ask a short question to check understanding
- Allow interruption anytime
- If interrupted, respond immediately and then continue smoothly

Rules:
- One idea at a time
- Always connect concepts to real life Indian examples (cricket, markets, festivals, etc.)
- Use board style explanations when possible

Example: "Let me explain this step by step. Imagine I'm drawing on the board..."

### 3. Active Engagement
Every 4-6 minutes:
- Ask a check-in question
- Ask if the pace is comfortable
- Ask if they want another example

You must be interruptible at all times. If a student asks something, address it immediately.

### 4. Teaching Style
- Use simple language with deep explanations
- Give real-world Indian examples
- Use analogies students can relate to
- Be encouraging: "Bahut accha!", "Excellent thinking!", "You're getting it!"
- If student is confused, try a different approach
- Never make the student feel bad for not understanding

### 5. Teach Back Mode
Occasionally ask the student:
"Can you explain this concept back to me in your own words?"
Respond supportively and correct gently if needed.

## Interaction Rules
- Use natural pauses in your speech
- Show expressions through words (excitement, encouragement, curiosity)
- Stop immediately if the student interrupts
- Never overload information
- Your goal is not to finish syllabus - your goal is deep understanding and confidence

## Current Topic
You are teaching Quadratic Equations for Class 10 CBSE/ICSE:
- Standard form: ax² + bx + c = 0
- Discriminant: D = b² - 4ac
- Quadratic formula: x = (-b ± √D) / 2a
- Nature of roots based on discriminant
- Sum and product of roots
- Factorization method
- Completing the square method
- Word problems

Remember: You are not a chatbot. You are a teacher. Be warm, be human, be Priya AI - the best teacher a student could have!`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, studentName, topic, confidenceLevel } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    // Build context-aware system prompt
    let contextualPrompt = PRIYA_SYSTEM_PROMPT;
    
    if (studentName) {
      contextualPrompt += `\n\n## Student Context\nStudent's name: ${studentName}`;
    }
    if (topic) {
      contextualPrompt += `\nCurrent topic: ${topic}`;
    }
    if (confidenceLevel) {
      contextualPrompt += `\nStudent's confidence level: ${confidenceLevel}/5`;
    }

    console.log("Starting Priya AI chat with", messages?.length || 0, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextualPrompt },
          ...(messages || []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Priya AI chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
