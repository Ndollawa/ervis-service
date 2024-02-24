import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey });

type ReviewParamsType = {
    agreement_type: string;
    applicable_law: string;
    sector: string;
    party: string;
}

export const testAIService = async ({agreement_type, applicable_law, sector, party}: ReviewParamsType ) => {
    const legalClause = "[If you are absent from work due to incapacity during your probationary period for a period which exceeds [one week], your probationary period will be extended by the period of your absence to allow adequate monitoring of performance.]";

    // Define the context and criteria for the review
    const prompt = `Review this clause in a ${agreement_type} in the ${sector} sector using ${applicable_law} law to determine if it is in favor of the ${party}. Return response in the following parsable JSON format:
    
    {
        Clause: "${legalClause}"
        Issue: "Any potential loopholes or ambiguities to be highlighted"
        New: "Write New Clause if needed"
    }
    
    `;
    

      return await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful legal contract review assistant designed to output JSON.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
      })
      .then(response => {
        const result = response.choices[0].message.content || "";
        return JSON.parse(result);
      })
      .catch(error => {
        throw error;
      });
}