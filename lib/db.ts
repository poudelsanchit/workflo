import mongoose from "mongoose";
type connectionType = {
  isConnected?: number;
};

const connection: connectionType = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Database already connected!");
    return;
  }

  if (mongoose.connection.readyState === 1) {
    console.log("Database already connected, checked through mongoose");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/"
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
export default dbConnect;
