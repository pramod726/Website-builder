// controllers/project.js
const Project = require('../models/Project');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create a new project
exports.createProject = async (req, res) => {
  console.log("[createProject] Request received:", { body: req.body });
  try {
    const { title, initialPrompt } = req.body;
    const userId = req.body._id; // Changed from req.user.id to req.body._id
    
    console.log("[createProject] User ID:", userId);
    console.log("[createProject] Project title:", title);

    // Create a new project
    const project = new Project({
      userId,
      title: title || 'Untitled UI Project',
      status: 'active',
      interactions: [],
      files: []
    });

    console.log("[createProject] Project object created:", project);

    // Save the project
    await project.save();
    console.log("[createProject] Project saved to database");

    // Add project to user's projects array
    await User.findByIdAndUpdate(userId, {
      $push: { projects: project._id }
    });
    console.log("[createProject] Project added to user's projects array");

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("[createProject] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message
    });
  }
};

// Get all projects for a user
exports.getUserProjects = async (req, res) => {
  console.log("[getUserProjects] Request received");
  try {
    const userId = req.body._id; // Changed from req.user.id to req.body._id
    console.log("[getUserProjects] Fetching projects for userId:", userId);
    
    const projects = await Project.find({ userId })
      .select('title status createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    console.log(`[getUserProjects] Found ${projects.length} projects`);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("[getUserProjects] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message
    });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  console.log("[getProjectById] Request received for project:", req.params.id);
  try {
    const projectId = req.params.id;
    const userId = req.body._id; // Changed from req.user.id to req.body._id
    
    console.log("[getProjectById] User ID:", userId);

    const project = await Project.findOne({ 
      _id: projectId,
      userId
    });

    if (!project) {
      console.log("[getProjectById] Project not found or not owned by user");
      return res.status(404).json({
        success: false,
        message: "Project not found",
        data: project
      });
    }

    console.log("[getProjectById] Project found:", project._id);
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("[getProjectById] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message
    });
  }
};

// Update project details
exports.updateProject = async (req, res) => {
  console.log("[updateProject] Request received for project:", req.params.id);
  console.log("[updateProject] Request body:", req.body);
  
  try {
    const projectId = req.params.id;
    const userId = req.body._id; // Changed from req.user.id to req.body._id
    const { title, status, files } = req.body;

    console.log("[updateProject] User ID:", userId);
    
    // Find the project and verify ownership
    const project = await Project.findOne({ 
      _id: projectId, 
      userId 
    });

    if (!project) {
      console.log("[updateProject] Project not found or not owned by user");
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Update fields if provided
    if (title) {
      console.log("[updateProject] Updating title to:", title);
      project.title = title;
    }
    
    if (status) {
      console.log("[updateProject] Updating status to:", status);
      project.status = status;
    }
    
    // Update files if provided
    if (files && Array.isArray(files)) {
      console.log(`[updateProject] Updating ${files.length} files`);
      // Clear current files and add new ones
      project.files = files.map(file => ({
        name: file.filename || file.name,
        type: file.filepath ? file.filepath.split('.').pop() : 'js',
        content: file.code || file.content,
        updatedAt: new Date()
      }));
    }

    await project.save();
    console.log("[updateProject] Project updated successfully");

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("[updateProject] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  console.log("[deleteProject] Request received for project:", req.params.id);
  try {
    const projectId = req.params.id;
    const userId = req.body._id; // Changed from req.user.id to req.body._id
    
    console.log("[deleteProject] User ID:", userId);

    // Find and delete the project
    const project = await Project.findOneAndDelete({ 
      _id: projectId, 
      userId 
    });

    if (!project) {
      console.log("[deleteProject] Project not found or not owned by user");
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    console.log("[deleteProject] Project deleted from database");
    
    // Remove from user's projects array
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: projectId }
    });
    console.log("[deleteProject] Project removed from user's projects array");

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("[deleteProject] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message
    });
  }
};

// Save chat interaction and update project
exports.saveInteraction = async (req, res) => {
  console.log("[saveInteraction] Request received for project:", req.params.id);
  console.log("[saveInteraction] Request body:", {
    role: req.body.role,
    message: req.body.message?.substring(0, 50) + "...", // Log just the beginning of the message
    filesCount: req.body.files?.length || 0
  });
  
  try {
    const projectId = req.params.id;
    const userId = req.body._id; // Changed from req.user.id to req.body._id
    const { role, message, files } = req.body;

    console.log("[saveInteraction] User ID:", userId);
    
    // Find the project and verify ownership
    const project = await Project.findOne({ 
      _id: projectId, 
      userId 
    });

    if (!project) {
      console.log("[saveInteraction] Project not found or not owned by user");
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Add new interaction
    if (role && message) {
      console.log("[saveInteraction] Adding new interaction with role:", role);
      project.interactions.push({
        role,
        message,
        timestamp: new Date()
      });
    }

    // Update files if provided
    if (files && Array.isArray(files)) {
      console.log(`[saveInteraction] Updating ${files.length} files`);
      // Process the files from Julep AI format to our schema format
      const updatedFiles = files.map(file => ({
        name: file.filename || file.name,
        type: file.filepath ? file.filepath.split('.').pop() : 'js',
        content: file.code || file.content,
        updatedAt: new Date()
      }));
      
      project.files = updatedFiles;
    }

    await project.save();
    console.log("[saveInteraction] Project updated with new interaction");

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("[saveInteraction] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save interaction",
      error: error.message
    });
  }
};