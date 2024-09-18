import db from "../config/ConnectDb";
import { seedAdminUser } from "./AdminSeeder";

async function main() {
  try {
    //enter your seeder function in here
    await seedAdminUser();
  } catch (err) {
    console.log("Seeder failed:", err);
    process.exit(1);
  }
}

main();
