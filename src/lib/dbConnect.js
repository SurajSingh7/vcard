import mongoose from "mongoose";

// MongoDB Connection URI from the environment variable
const MONGO_URI = process.env.MONGO_URI;

const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    // If already connected, skip the connection logic
   
    return;
  }

  try {
    // Attempt to connect to MongoDB using the connection URI
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other options if necessary, like `serverSelectionTimeoutMS`
    });
  
  } catch (error) {
    // Log the error and rethrow it for better handling
   
    throw new Error("Failed to connect to database");
  }

  // Event listeners to handle MongoDB connection events
  mongoose.connection.on("connected", () => {
  
  });

  mongoose.connection.on("error", (err) => {
   
  });

  mongoose.connection.on("disconnected", () => {
   
  });
};

export default dbConnect;







