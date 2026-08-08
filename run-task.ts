import { createUserTask } from "./src/lib/create-user-task.functions";

async function run() {
  try {
    const result = await createUserTask({
      data: {
        email: "lucaon.lc@gmail.com",
        password: "12345678"
      }
    });
    console.log("SUCCESS:", JSON.stringify(result));
  } catch (e) {
    console.error("FAILED:", e);
  }
}

run();
