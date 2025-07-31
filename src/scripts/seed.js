import mongoose from 'mongoose';
import Question from '../models/Question.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleQuestions = [
  {
    title: "How to implement authentication in React?",
    description: "I'm building a React application and need to implement user authentication. What are the best practices and recommended libraries?",
    content: "I'm building a React application and need to implement user authentication. What are the best practices and recommended libraries? I've heard about JWT tokens and OAuth, but I'm not sure which approach to take.",
    tags: ["react", "authentication", "javascript", "frontend"],
    status: "open",
    isApproved: true,
    votes: 15,
    comments: [
      {
        text: "I recommend using Firebase Auth for quick setup",
        author: "John Doe",
        createdAt: new Date()
      }
    ]
  },
  {
    title: "Best practices for MongoDB schema design",
    description: "What are the key principles for designing efficient MongoDB schemas?",
    content: "I'm working on a new project and want to ensure my MongoDB schema is well-designed from the start. What are the key principles I should follow?",
    tags: ["mongodb", "database", "schema", "nosql"],
    status: "open",
    isApproved: true,
    votes: 8,
    comments: []
  },
  {
    title: "How to deploy a Node.js app to production?",
    description: "Looking for a step-by-step guide to deploy my Node.js application to production.",
    content: "I have a Node.js application that I want to deploy to production. What are the best hosting options and deployment strategies?",
    tags: ["nodejs", "deployment", "production", "hosting"],
    status: "open",
    isApproved: true,
    votes: 12,
    comments: [
      {
        text: "Heroku is great for beginners",
        author: "Jane Smith",
        createdAt: new Date()
      },
      {
        text: "Consider using Docker for containerization",
        author: "Mike Johnson",
        createdAt: new Date()
      }
    ]
  },
  {
    title: "Understanding async/await in JavaScript",
    description: "Can someone explain async/await with practical examples?",
    content: "I'm trying to understand async/await in JavaScript. Can someone provide practical examples and explain when to use them?",
    tags: ["javascript", "async", "await", "promises"],
    status: "closed",
    isApproved: true,
    votes: 25,
    comments: [
      {
        text: "Async/await is syntactic sugar over promises",
        author: "Alice Brown",
        createdAt: new Date()
      }
    ]
  },
  {
    title: "CSS Grid vs Flexbox - when to use which?",
    description: "What are the differences between CSS Grid and Flexbox, and when should I use each?",
    content: "I'm learning CSS layout and confused about when to use Grid vs Flexbox. Can someone explain the differences and use cases?",
    tags: ["css", "grid", "flexbox", "layout"],
    status: "open",
    isApproved: true,
    votes: 18,
    comments: []
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    const questions = await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${questions.length} sample questions`);

    // Get a user for author reference
    const user = await User.findOne();
    if (user) {
      // Update questions with author
      await Question.updateMany({}, { author: user._id });
      console.log('Updated questions with author reference');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
