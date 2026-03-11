/*import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, 
  baseURL: "https://api.groq.com/openai/v1",
});

const response = await client.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "user", content: "Difference between SQL and MongoDB" }
  ],
});

console.log(response.choices[0].message.content);*/

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app=express();
const PORT=8080;
app.use(cors({origin:"https://sigmagptfrontend-kpn2.onrender.com"}));
app.use(express.json());

app.use("/api",chatRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  }
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

/*app.post("/test", async(req,res)=>{

const options = {
  method: 'POST',
  headers: {
  "Content-Type": "application/json" ,
   "Authorization":`Bearer ${process.env.GROQ_API_KEY}`
  },
  body: JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: req.body.message }
    ],
  })
};
    try {
     const response= await fetch("https://api.groq.com/openai/v1/chat/completions", options);
      const data= await response.json();
      //console.log(data.choices[0].message.content);
      res.send(data.choices[0].message.content);
 }
  catch(error){
      console.error(error);
  }
});*/
