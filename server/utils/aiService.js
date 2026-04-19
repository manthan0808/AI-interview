const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Generate interview questions from resume text and job details
 */
const generateQuestions = async (resumeText, jobRole, experience, techCount = 6, hrCount = 4, persona = "friendly") => {
  try {
    const personaStyle = persona === "strict" 
      ? "a Strict FAANG Senior Engineer who focuses on deep technical rigor, performance, and scalability" 
      : "a Friendly HR Manager who focuses on culture fit, storytelling, and soft skills";

    const totalQuestions = techCount + hrCount;
    const prompt = `You are ${personaStyle}. Based on the following resume and job details, generate exactly ${totalQuestions} interview questions — ${techCount} technical question${techCount !== 1 ? "s" : ""} and ${hrCount} HR/behavioral question${hrCount !== 1 ? "s" : ""}.

Job Role: ${jobRole}
Experience Level: ${experience}

Resume:
${resumeText}

IMPORTANT: Return ONLY a valid JSON array with no additional text, markdown, or explanation. Each object must have these exact fields:
- "id" (number, 1-${totalQuestions})
- "question" (string)
- "type" (string, either "technical" or "hr")

You MUST generate exactly ${techCount} questions with type "technical" and exactly ${hrCount} questions with type "hr".

Example format:
[{"id":1,"question":"...","type":"technical"},{"id":2,"question":"...","type":"hr"}]`;

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a JSON-only response bot. You return only valid JSON arrays with no markdown formatting, no code blocks, no extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "X-Title": "AI Interview Agent",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();

    // Try to parse — strip markdown code fences if present
    let cleaned = content;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    }

    const questions = JSON.parse(cleaned);
    return questions;
  } catch (error) {
    console.error("AI question generation error:", error?.response?.data || error.message);
    throw new Error("Failed to generate interview questions from AI");
  }
};

/**
 * Generate feedback for a single answer
 */
const generateFeedback = async (question, answer, persona = "friendly") => {
  try {
    const questionType = question.toLowerCase().includes("technical") ? "technical" : "hr";
    
    const personaStyle = persona === "strict" 
      ? "a Strict FAANG Senior Engineer who is very critical, looks for perfection, and values efficiency. Be blunt in feedback." 
      : "a Friendly HR Manager who is encouraging, positive, and values culture fit.";

    const starLogic = questionType === "hr" 
      ? "Specifically evaluate if the user used the STAR (Situation, Task, Action, Result) method. Mention which parts were missing in the feedbackText." 
      : "Evaluate technical depth and accuracy.";

    const prompt = `You are ${personaStyle}.
    
Question: "${question}"
Candidate's Answer: "${answer}"

${starLogic}

Provide constructive feedback in exactly this JSON format (no markdown, no code blocks, just raw JSON):
{
  "feedbackText": "3-4 sentences of constructive feedback here",
  "rating": 7,
  "categories": {
    "technical": 8,
    "communication": 7,
    "star_context": 5,
    "logic": 6,
    "confidence": 9
  }
}

The rating must be a number from 1 to 10. The 'categories' object must contain numbers 1-10 for each key.
- technical: technical depth or behavioral specificity.
- communication: clarity and tone.
- star_context: for HR, score the STAR method use. For tech, context provided.
- logic: problem solving approach.
- confidence: tone and conviction.`;

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a JSON-only response bot. Return only valid JSON with no markdown formatting, no code blocks, no extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 600,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "X-Title": "AI Interview Agent",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();

    let cleaned = content;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    }

    const feedback = JSON.parse(cleaned);
    return feedback;
  } catch (error) {
    console.error("AI feedback generation error:", error?.response?.data || error.message);
    throw new Error("Failed to generate feedback from AI");
  }
};

module.exports = { generateQuestions, generateFeedback };
