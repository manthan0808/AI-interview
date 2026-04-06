const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Generate interview questions from resume text and job details
 */
const generateQuestions = async (resumeText, jobRole, experience) => {
  try {
    const prompt = `You are an expert technical interviewer with 15+ years of experience. Based on the following resume and job details, generate exactly 10 interview questions — 6 technical questions and 4 HR/behavioral questions.

Job Role: ${jobRole}
Experience Level: ${experience}

Resume:
${resumeText}

IMPORTANT: Return ONLY a valid JSON array with no additional text, markdown, or explanation. Each object must have these exact fields:
- "id" (number, 1-10)
- "question" (string)
- "type" (string, either "technical" or "hr")

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
const generateFeedback = async (question, answer) => {
  try {
    const prompt = `You are an expert interviewer evaluating a candidate's response.

Question: "${question}"
Candidate's Answer: "${answer}"

Provide constructive feedback in exactly this JSON format (no markdown, no code blocks, just raw JSON):
{"feedbackText":"3-4 sentences of constructive feedback here","rating":7}

The rating must be a number from 1 to 10. Be fair but constructive. Mention strengths and areas for improvement.`;

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
        max_tokens: 500,
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
