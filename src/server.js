import app from "./app.js";
import connectDB from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connection established");

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly (not when imported as a module)
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default startServer;
