import { Request } from "express";
import argon2 from "argon2";
import { AuthRepository } from "../repository/AuthRepository";

export class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository
    }

    async login(email: string, password: string) {
        const user = await this.authRepository.getUserFromEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        return { userId: user.id };
    }

    async logout(req: Request): Promise<void> {
        return new Promise((resolve, reject): void => {
            req.session.destroy((err) => {
                if (err) {
                    reject(new Error("Error logging out"));
                } else {
                    resolve();
                }
            })
        })
    }

    async register(name: string, email: string, password: string) {

        if (!this.isValidEmail(email)) {
            throw new Error("Email format invalid");
        }

        if (!this.isValidPassword(password)) {
            throw new Error("Password must be at least 8 characters long");
        }

        if (this.authRepository.getUserFromEmail(email)) {
            throw new Error("User already exists");
        }

        try {
            const hashedPassword = await argon2.hash(password);

            const userData = {
                name: name,
                email: email,
                password: hashedPassword,
            }

            await this.authRepository.createUser(userData);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Error registering user: ${error.message}`)
        }        

    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password: string): boolean {
        return password.length >= 8;
    }
}