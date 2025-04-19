const dotenv = require("dotenv");
const Julep = require("@julep/sdk");
const yaml = require("yaml");

const client = new Julep({ apiKey: process.env.JULEP_API_KEY });

async function createAgent() {
    try {
        const agent = await client.agents.create({
            name: "website generator",
            model: "claude-3.5-sonnet",
            about: "An AI agent that generates a detailed plan for building a website from a prompt.",
            config: {
                max_tokens: 4000
            }
        });

        console.log("Agent Created:", agent.id);
        return agent.id;
    } catch (error) {
        console.error("Error creating agent:", error);
    }
}

const taskYaml = `
name: React Website Generator
description: Generate production-ready React components from a website idea
input_schema:
  type: object
  properties:
    website_idea:
      type: string
      description: A short description of the website to build

main:
  - prompt: |-
      $ f"""You are a senior frontend developer. Based on the following idea, generate a production-ready React app. The idea:

      "{steps[0].input.website_idea}"

      Requirements:
      - Use modern React with functional components
      - Include Tailwind CSS for styling
      - Break the app into multiple components (e.g., Navbar, Footer, MainContent)
      - Code should be clean and modular
      - Wrap the code inside a default React project structure
      - Output all the code as a which will work on sandpack
      - The output generated should be in max length that is 4000.
      - The code should contains all essential files to run on sandpack like App.js, index.js, package.json
      - Please output the code as a JSON array. Each item in the array should be an object with the following structure: {{ "filename": "example filename with extension", "filepath": "full relative or absolute path to the file", "code": "the full code content as a string" }}
      - Make sure the response is valid JSON — without extra explanations or markdown code fences. The response should only contain the JSON array.
      """
    unwrap: true
`;


async function createTask(agentId) {
    try {
        const task = await client.tasks.create(agentId, yaml.parse(taskYaml));

        console.log("Task Created:", task.id);
        return task.id;
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

function parseCodeBlock(rawOutput) {

    let parsed;

    try {
        parsed = JSON.parse(rawOutput);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return [];
    }

    return parsed.map(file => ({
        filename: file.filename,
        filepath: file.filepath,
        code: file.code
    }));
}


async function executeTask(taskId, content) {
    const execution = await client.executions.create(taskId, {
        input: { website_idea: content },
    });

    while (true) {
        const result = await client.executions.get(execution.id);
        console.log(result.output);
        if (result.status === "succeeded" || result.status === "failed") {
            if (result.status === "succeeded") {
                console.log("\n🧭 Website components:\n", result.output);
                const parsedFiles = parseCodeBlock(result.output);
                // console.log(parsedFiles);
                return parsedFiles;
            } else {
                throw new Error(result.error);
            }
            break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

exports.prompt = async (req, res) => {
    try {
        const content = req.body.prompt || "Create a website for a restaurant that serves Italian food.";
        console.log("api called ");
        const agentId = await createAgent();
        const taskId = await createTask(agentId);
        const parsedFiles = await executeTask(taskId, content);
        console.log("output sent");
        res.json(parsedFiles);
    } catch (error) {
        console.error("Error in /prompt:", error);
        res.status(500).json({ error: error.message });
    }
};


async function createModifierAgent() {
    try {
        const agent = await client.agents.create({
            name: "React Code Modifier",
            model: "claude-3.5-sonnet",
            about: "An AI agent that modifies existing React code based on user instructions.",
            config: {
                max_tokens: 4000
            }
        });

        console.log("Modifier Agent Created:", agent.id);
        return agent.id;
    } catch (error) {
        console.error("Error creating modifier agent:", error);
    }
}

const modifyTaskYaml = `
name: React Code Modifier Task
description: Modify existing React code based on user instructions.
input_schema:
  type: object
  properties:
    existing_code:
      type: string
      description: The current JSON array of code files.
    modification_instruction:
      type: string
      description: A short description of the modification to apply.

main:
  - prompt: |-
      $ f"""You are a senior frontend developer. Based on the following existing code and modification instruction:

      Existing Code:
      {steps[0].input.existing_code}

      Modification Instruction:
      {steps[0].input.modification_instruction}

      Please apply the changes cleanly while following best practices:

      - Use modern React with functional components.
      - Preserve the code structure unless the instruction demands otherwise.
      - Output a JSON array. Each item must be:
      {{ "filename": "example filename with extension", "filepath": "full relative or absolute path to the file", "code": "the full code content as a string" }}
      - Make sure the response is valid JSON with no explanations or markdown.
      """
    unwrap: true
`;

async function createModifyTask(agentId) {
    try {
        const task = await client.tasks.create(agentId, yaml.parse(modifyTaskYaml));
        console.log("Modifier Task Created:", task.id);
        return task.id;
    } catch (error) {
        console.error("Error creating modify task:", error);
    }
}

function parseCodeBlock(rawOutput) {
    let parsed;
    try {
        parsed = JSON.parse(rawOutput);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return [];
    }
    return parsed.map(file => ({
        filename: file.filename,
        filepath: file.filepath,
        code: file.code
    }));
}

async function executeModifyTask(taskId, existingCode, instruction) {
    const execution = await client.executions.create(taskId, {
        input: {
            existing_code: JSON.stringify(existingCode),
            modification_instruction: instruction
        }
    });

    while (true) {
        const result = await client.executions.get(execution.id);
        console.log(result.output);
        if (result.status === "succeeded" || result.status === "failed") {
            if (result.status === "succeeded") {
                const parsedFiles = parseCodeBlock(result.output);
                return parsedFiles;
            } else {
                throw new Error(result.error);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

exports.modify = async (req, res) => {
    try {
        const { existingCode, instruction } = req.body;
        console.log("Modification API called");

        const agentId = await createModifierAgent();
        const taskId = await createModifyTask(agentId);
        const updatedFiles = await executeModifyTask(taskId, existingCode, instruction);

        console.log("Modified code sent");
        res.json(updatedFiles);
    } catch (error) {
        console.error("Error in /modify:", error);
        res.status(500).json({ error: error.message });
    }
};