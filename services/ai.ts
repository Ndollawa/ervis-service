import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { JsonOutputParser } from "@langchain/core/output_parsers";

dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: "gpt-4-0125-preview", //gpt-3.5-turbo-0125
});

type ReviewParamsType = {
  contract: string;
  agreement_type: string;
  applicable_law: string;
  sector: string;
  party: string;
};

export const reviewContract = async ({
  contract,
  agreement_type,
  applicable_law,
  sector,
  party,
}: ReviewParamsType) => {
  const template = `You are a helpul legal contract review assistant. Review the following {agreement_type} contract in the {sector} sector using {applicable_law} law and ensure it is in favor of the {party}. Return an array of clauses that have issues in the following parsable JSON format:
    
      Number: "Clause number or title"
      Clause: "Exact clause text"
      Comment: "Any potential loopholes or ambiguities to be highlighted"
      New: "Write new clause"

  Contract: {contract}
  
  `;

  const parser = new JsonOutputParser();

  const promptTemplate = new PromptTemplate({
    template,
    inputVariables: [
      "agreement_type",
      "sector",
      "applicable_law",
      "party",
      "contract",
    ],
  });

  const chain = new LLMChain({
    llm: model,
    prompt: promptTemplate,
    outputParser: parser,
  });

  const response = await chain.call({
    agreement_type,
    applicable_law,
    sector,
    party,
    contract,
    format_instructions: parser.toJSON(),
  });

  return response;
};
