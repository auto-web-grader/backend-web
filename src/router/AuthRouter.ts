import express from "express";
import { AuthController } from "../controller/AuthController";
import { AuthService } from "../service/AuthService";
import { AuthRepository } from "../repository/AuthRepository";
import authMiddleware from "../middleware/AuthMiddleware";

const router = express.Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.post("/register", (req, res) => authController.register(req, res));
// router.get("/me", authMiddleware, (req, res) => authController.getMe(req, res));

export default router;
