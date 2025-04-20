const express = require('express');
const router = express.Router();

const { usersignup, userlogin, logout } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const { prompt, modify } = require('../controllers/agent');
const { createProject, getUserProjects, getProjectById, updateProject, deleteProject, saveInteraction } = require('../controllers/projectController');

// authetication routes
router.post("/user/signUp", usersignup);
router.post("/user/logIn", userlogin);
router.post("/user/logOut", auth, logout);

// agent interaction handling and response generation routes
router.post("/prompt",auth, prompt);
router.post("/modify/:projectId", auth, modify);

// project related routes
router.post("/projects", auth, createProject);
router.get("/projects", auth, getUserProjects);
router.get("/projects/:id", auth, getProjectById);
router.put("/projects/:id", auth, updateProject);
router.delete("/projects/:id", auth, deleteProject);
router.post("/projects/:id/saveInteraction", auth, saveInteraction);

module.exports = router;
