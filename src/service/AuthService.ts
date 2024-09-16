import { Request } from "express";
import argon2 from "argon2";
import { AuthRepository } from "../repository/AuthRepository";
import { CustomError } from "../utils/ErrorHandling";
import { StatusCodes } from "http-status-codes";

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.authRepository.getUserFromEmail(email);
      if (!user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid Credentials");
      }

      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid Credentials");
      }

      return { userId: user.id };
    } catch (error) {
      throw new CustomError(
        error.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
        error.message ?? "Error authenticating user",
        error
      );
    }
  }

  async logout(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.destroy((err) => {
        if (err) {
          reject(
            new CustomError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "Error when logout",
              err
            )
          );
        } else {
          resolve();
        }
      });
    });
  }

  async register(name: string, email: string, password: string) {
    if (!this.isValidEmail(email)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid Email Format");
    }

    if (!this.isValidPassword(password)) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Password length not match, must be 8 character long"
      );
    }

    if (await this.authRepository.getUserFromEmail(email)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Email already exists");
    }

    try {
      const hashedPassword = await argon2.hash(password);

      const userData = {
        name: name,
        email: email,
        password: hashedPassword,
      };

      await this.authRepository.createUser(userData);
    } catch (error) {
      console.log(error.message);
      throw new CustomError(
        error.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
        error.message ?? "Error when creating user",
        error
      );
    }
  }

  async getUserById(userId: number) {
    try {
      const user = await this.authRepository.getUserFromId(userId);
      if (!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "User Cannot Be Found");
      }
      return user;
    } catch (error) {
      throw new CustomError(
        error.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
        error.message,
        error
      );
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
