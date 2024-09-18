import db from "../config/ConnectDb";
import argon2 from "argon2";

export const seedAdminUser = async () => {
  if (process.env.NODE_ENV === 'development') {
    const adminUser = {
      name: 'admin',
      email: 'admin@admin.com',
      password: await argon2.hash(process.env.ADMIN_PASSWORD),
      role: 'admin',
    };

    let user = await db.user.findUnique({
      where: { email: adminUser.email },
    });
    
    if (!user) {
        user = await db.user.create({
            data: adminUser,
        });
    }
  }
};