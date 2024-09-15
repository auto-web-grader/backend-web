import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { LoginRequest, RegisterRequest, SessionData } from "../model/AuthModel";

export class AuthController {
    private authService: AuthService;

    constructor (authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request<any, any, LoginRequest>, res: Response) {
        const { email, password } = req.body;
        
        try {
            const result = await this.authService.login(email, password);
            
            if (result) {
                (req.session as SessionData).userId = result.userId.toString();
                res.json({ message: "Login successful "});
            }

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Login failed" });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            await this.authService.logout(req);
            res.clearCookie("connect.sid");
            res.json({ message: "Logged out" });
        } catch (error) {
            res.status(500).json({ message: "Error loggin out" });
        }
    }

    async register(req: Request<any, any, RegisterRequest>, res: Response) {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email or password is missing");
        }

        try {
            const result = await this.authService.register(name, email, password);
            res.status(200).json({ message: "Registration successful" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Register failed" });
        }

    }
}