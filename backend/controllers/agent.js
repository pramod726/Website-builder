const dotenv = require("dotenv");
const Julep = require("@julep/sdk");
const yaml = require("yaml");
dotenv.config();

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
description: Modify existing React code based on user instructions, with error handling.
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
      $ f"""You are a senior frontend developer. You will receive a JSON array representing an entire React project (all files and their contents) and a modification instruction.

      Existing Code:
      {steps[0].input.existing_code}

      Modification Instruction:
      {steps[0].input.modification_instruction}

      Requirements:
      - Apply only the minimal changes needed; preserve all unaffected files and overall project structure.
      - Use modern React with functional components.
      - Ensure no essential files are removed.
      - If the instruction is invalid or the modification cannot be applied, return a JSON object:
        {{ "error": "A clear description of why the change failed" }}
      - Otherwise, return a JSON array of **all** project files (changed and unchanged). Each item must be:
        {{ "filename": "file name with extension", "filepath": "relative file path", "code": "full file contents as a string" }}
      - The response must be valid JSON only, with no additional text or markdown fences.
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
        // console.log(result.output);
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

/**
 * Handles initial prompt for a new project
 * This function should be called only when starting a new project
 */
exports.prompt = async (req, res) => {
    console.log("[prompt] Initial project generation request received");
    console.log("[prompt] Request body:", {
        promptPreview: req.body.prompt?.substring(0, 50) + "...",
        projectId: req.body.projectId,
        userId: req.body._id
    });
    
    try {
        const content = req.body.prompt || "Create a website for a restaurant that serves Italian food.";
        const projectId = req.body.projectId;
        console.log("[prompt] Processing initial prompt: " + content.substring(0, 50) + "...");
        
        const agentId = await createAgent();
        console.log("[prompt] Agent created with ID:", agentId);
        
        const taskId = await createTask(agentId);
        console.log("[prompt] Task created with ID:", taskId);
        
        const parsedFiles = await executeTask(taskId, content);
        console.log(`[prompt] Task executed, received ${parsedFiles.length} files`);
        
        // Always save to project if it exists (this should be the first interaction)
        if (projectId && req.body._id) {
            console.log("[prompt] Saving initial files to project:", projectId);
            try {
                const Project = require('../models/Project');
                
                // Find the project
                const project = await Project.findOne({
                    _id: projectId,
                    userId: req.body._id
                });
                
                if (project) {
                    console.log("[prompt] Project found, updating with initial content");
                    
                    // Add initial user prompt
                    project.interactions.push({
                        role: 'user',
                        message: content,
                        timestamp: new Date()
                    });
                    
                    // Add AI response
                    project.interactions.push({
                        role: 'assistant',
                        message: 'Generated initial website code based on your prompt.',
                        timestamp: new Date()
                    });
                    
                    // Update files
                    project.files = parsedFiles.map(file => ({
                        name: file.filename,
                        type: file.filepath.split('.').pop(),
                        content: file.code,
                        updatedAt: new Date()
                    }));
                    
                    // Update project status
                    project.status = 'active';
                    
                    await project.save();
                    console.log("[prompt] Project updated with initial files");
                } else {
                    console.log("[prompt] Project not found or not owned by user");
                }
            } catch (dbError) {
                console.error("[prompt] Error saving to database:", dbError);
                // Continue even if DB save fails
            }
        } else {
            console.log("[prompt] No project ID or user ID provided, returning files without saving");
        }
        
        console.log("[prompt] Sending initial files to client");
        res.json(parsedFiles);
    } catch (error) {
        console.error("[prompt] Error processing initial request:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

/**
 * Handles all subsequent interactions with an existing project
 * This function should be called for all interactions after the initial prompt
 */
exports.modify = async (req, res) => {
    console.log("[modify] Project modification request received");
    console.log("[modify] Request body:", {
        instructionPreview: req.body.instruction?.substring(0, 50) + "...",
        projectId: req.body.projectId,
        userId: req.body._id,
        existingCodeCount: req.body.existingCode?.length || 0
    });
    
    try {
        const { existingCode, instruction, projectId } = req.body;
        
        // Validate required parameters
        if (!existingCode || !Array.isArray(existingCode) || existingCode.length === 0) {
            console.error("[modify] Missing or invalid existingCode parameter");
            return res.status(400).json({
                success: false,
                message: "Missing or invalid existingCode parameter"
            });
        }
        
        if (!instruction || typeof instruction !== 'string') {
            console.error("[modify] Missing or invalid instruction parameter");
            return res.status(400).json({
                success: false,
                message: "Missing or invalid instruction parameter"
            });
        }
        
        if (!projectId) {
            console.error("[modify] Missing projectId parameter");
            return res.status(400).json({
                success: false,
                message: "Missing projectId parameter"
            });
        }
        
        console.log("[modify] Processing modification instruction: " + instruction.substring(0, 50) + "...");
        console.log("[modify] Existing files count:", existingCode.length);

        const agentId = await createModifierAgent();
        console.log("[modify] Modifier agent created with ID:", agentId);
        
        const taskId = await createModifyTask(agentId);
        console.log("[modify] Modify task created with ID:", taskId);
        
        const updatedFiles = await executeModifyTask(taskId, existingCode, instruction);
        console.log(`[modify] Task executed, received ${updatedFiles.length} updated files`);

        // Always save modifications to project
        if (req.body._id) {
            console.log("[modify] Saving modifications to project:", projectId);
            try {
                const Project = require('../models/Project');
                
                // Find the project
                const project = await Project.findOne({
                    _id: projectId,
                    userId: req.body._id
                });
                
                if (project) {
                    console.log("[modify] Project found, updating with modified content");
                    
                    // Add user instruction
                    project.interactions.push({
                        role: 'user',
                        message: instruction,
                        timestamp: new Date()
                    });
                    
                    // Add AI response
                    project.interactions.push({
                        role: 'assistant',
                        message: 'Modified website code based on your instruction.',
                        timestamp: new Date()
                    });
                    
                    // Update files with the new versions
                    project.files = updatedFiles.map(file => ({
                        name: file.filename,
                        type: file.filepath.split('.').pop(),
                        content: file.code,
                        updatedAt: new Date()
                    }));
                    
                    await project.save();
                    console.log("[modify] Project updated with modified files");
                } else {
                    console.error("[modify] Project not found or not owned by user");
                    return res.status(404).json({
                        success: false,
                        message: "Project not found or not owned by current user"
                    });
                }
            } catch (dbError) {
                console.error("[modify] Error saving to database:", dbError);
                // Don't fail the request if DB save fails
            }
        } else {
            console.error("[modify] No user ID provided in request");
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        console.log("[modify] Sending modified files to client");
        res.json(updatedFiles);
    } catch (error) {
        console.error("[modify] Error processing modification:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

/**
 * Utility function to handle saving project interactions
 * This can be called from both prompt and modify functions
 * @param {Object} project - The project document from MongoDB
 * @param {String} userMessage - The message from the user
 * @param {String} assistantMessage - The response message from the assistant
 * @param {Array} files - The files to save to the project
 */
async function saveProjectInteraction(project, userMessage, assistantMessage, files) {
    if (!project) return;
    
    console.log("[saveProjectInteraction] Saving interaction to project:", project._id);
    
    // Add user message
    if (userMessage) {
        project.interactions.push({
            role: 'user',
            message: userMessage,
            timestamp: new Date()
        });
    }
    
    // Add assistant response
    if (assistantMessage) {
        project.interactions.push({
            role: 'assistant',
            message: assistantMessage,
            timestamp: new Date()
        });
    }
    
    // Update files if provided
    if (files && Array.isArray(files)) {
        console.log(`[saveProjectInteraction] Updating ${files.length} files`);
        
        project.files = files.map(file => ({
            name: file.filename,
            type: file.filepath.split('.').pop(),
            content: file.code,
            updatedAt: new Date()
        }));
    }
    
    // Save the changes
    await project.save();
    console.log("[saveProjectInteraction] Project updated successfully");
}