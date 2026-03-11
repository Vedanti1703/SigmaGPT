import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIResponse from '../utils/openai.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


//test route
router.post('/test', async (req, res) => { 
    try {
      const thread= new Thread({    
        threadId: "xyz",
        title: "Test Thread"
});
        const response=await thread.save();
        res.send(response);
}
        catch (error) { 
            console.error(error);
            res.status(500).json({error: "Failed to save in DB"});
        }
});

//get all threads and arrage them acc to updatedAt
router.get('/thread', async (req, res) => {
    try{
     const threads= await Thread.find({}).sort({updatedAt: -1});//descending order
        res.json(threads);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

//get specific thread by id
router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
      const thread=await Thread.findOne({threadId});
      if(!thread){
        return res.status(404).json({error: "Thread not found"});
      } 
      res.json(thread.messages);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch thread"});
    }
});

//delete thread by id
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const deletedThread=await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            return res.status(404).json({error: "Thread not found"});
        }
        res.json({message: "Thread deleted successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

//post req main route for chat
router.post("/chat",authMiddleware,async(req,res)=>{
    const {threadId,message}=req.body;
    if(!threadId || !message){
        return res.status(400).json({error: "threadId and message are required"});
    }
    try{
       let thread=await Thread.findOne({threadId});
         if(!thread){   //new chat is created if threadId is not found in DB
           thread= new Thread({
            threadId,
            title: message,
            messages:[{role:"user",content:message}]
           });
         }
            else{
                thread.messages.push({role:"user",content:message});
            }

        const assistantReply= await getOpenAIResponse(message);//ollama

        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt=new Date();
        await thread.save();
        res.json({reply: assistantReply});
    
        }catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to process chat"});
    }
});

export default router;