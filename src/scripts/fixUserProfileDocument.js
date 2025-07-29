import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tamangadit:tamangadit@cluster0.zekqc4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const USER_ID = "68821f40eea66b3d8bc1d652";

const REQUIRED_FIELDS = {
  name: "Admin", // Use fullName as name
  username: "admin", // Add a username
  email: "admin@gmail.com",
  password: "dummy-password", // Replace with actual hash if needed
  bio: "This is a default bio.",
  location: "Kathmandu",
  profileImage: "https://lh3.googleusercontent.com/a/Acg8ocJxh-xiyf94GsqJL2T_s4jjgf2zzP...",
  github: "",
  linkedin: "",
  website: "",
  skills: [],
  reputation: 0,
  questionsAsked: 0,
  answersGiven: 0,
  upvotesReceived: 0,
  downvotesReceived: 0,
  role: "user",
  isVerified: true
};

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  const collection = db.collection("userprofiles");

  // Update the document to match schema
  await collection.updateOne(
    { _id: new mongoose.Types.ObjectId(USER_ID) },
    { $set: REQUIRED_FIELDS }
  );

  console.log("User profile document updated.");
  await mongoose.disconnect();
}

run().catch(err => {
  console.error("Error updating user profile:", err);
  process.exit(1);
});
