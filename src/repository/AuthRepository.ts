import db from "../config/ConnectDb";

export class AuthRepository {
    async createUser(data: { name: string, email: string, password: string }) {
        return db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            }
        });
    }

    async getUserFromEmail(email: string) {
        return db.user.findUnique({
            where: {
                email: email,
            }
        })
    }
}