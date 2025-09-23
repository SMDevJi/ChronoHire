import fs from 'fs';
import { extractText, getDocumentProxy } from 'unpdf'
import mammoth from 'mammoth';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Generate 7 AI questions (5 job-based, 2 resume-based)
export async function generateAIQuestions(role, description, resumeText, difficulty, yearsOfExperience) {
    try {

        const prompt = `
    You are an AI interview question generator.

    Candidate is applying for the role: **${role}**
    Job description: ${description}
    Years of experience: ${yearsOfExperience}
    Difficulty level: ${difficulty}
    Resume (raw text): ${resumeText}

    Generate exactly 7 interview questions:
    - 5 based on the role, description, difficulty, and years of experience
    - 2 specifically based on the candidate's resume

    Respond strictly in JSON format:
    [
      { "question": "..." },
      { "question": "..." },
      ...
    ]
    `;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const text = result.text;

        // Try parsing as JSON
        let questions;
        try {
            questions = JSON.parse(text);
        } catch {
            // Fallback if Gemini adds extra text
            const jsonMatch = text.match(/\[([\s\S]*)\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not parse Gemini response");
            }
        }

        // Ensure each question is in schema format
        return questions.map(q => ({ question: q.question || q }));
    } catch (err) {
        console.error("Gemini question generation failed:", err.message);
    }
}






// Extract resume text (mock version)
export async function extractResumeText(file) {
    const ext = file.substring(file.lastIndexOf('.') + 1)

    if (ext == 'pdf') {
        const buffer = fs.readFileSync(file)
        const pdf = await getDocumentProxy(new Uint8Array(buffer))
        const { text } = await extractText(pdf, { mergePages: true })
        console.log(text)
        return text;
    } else {
        const data = fs.readFileSync(file);

        const result = await mammoth.extractRawText({ buffer: data });
        //console.log(result.value);
        return result.value
    }

}






// Evaluate answers with AI (mock version)
export async function evaluateAnswers(questions) {
    const evaluatedQuestions = questions.map(q => ({
        ...q,
        aiFeedback: q.transcript.length > 20
            ? "Good explanation, but could add more details."
            : "Answer too short, expand further.",
        score: Math.min(100, 60 + q.transcript.length) // fake scoring logic
    }));

    const overallEvaluation = {
        contentRelevance: { relevant: 85, offTopic: 15 },
        grammarVocabulary: { correct: 90, minorErrors: 8, majorErrors: 2 },
        answerCompleteness: { full: 80, partial: 15, missed: 5 }
    };

    const overallScore = Math.round(
        evaluatedQuestions.reduce((acc, q) => acc + q.score, 0) / evaluatedQuestions.length
    );

    return { evaluatedQuestions, overallEvaluation, overallScore };
}
