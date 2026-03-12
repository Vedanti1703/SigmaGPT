import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIResponse from "../utils/openai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// TEST ROUTE
router.post("/test", async (req, res) => {
  try {

    const thread = new Thread({
      userId: req.user.userId,   // ⭐ add userId
      threadId: "xyz",
      title: "Test Thread"
    });

    const response = await thread.save();

    res.send(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});


// GET ALL THREADS OF LOGGED-IN USER
router.get("/thread", authMiddleware, async (req, res) => {

  try {

    const threads = await Thread.find({
      userId: req.user.userId      // ⭐ filter by user
    }).sort({ updatedAt: -1 });

    res.json(threads);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to fetch threads" });

  }

});


// GET SPECIFIC THREAD
router.get("/thread/:threadId", authMiddleware, async (req, res) => {

  const { threadId } = req.params;

  try {

    const thread = await Thread.findOne({
      threadId,
      userId: req.user.userId       
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to fetch thread" });

  }

});


// DELETE THREAD
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {

  const { threadId } = req.params;

  try {

    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.user.userId     
    });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ message: "Thread deleted successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to delete thread" });

  }

});


// MAIN CHAT ROUTE
router.post("/chat", authMiddleware, async (req, res) => {

  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" });
  }

  try {

    let thread = await Thread.findOne({
      threadId,
      userId: req.user.userId     
    });


    // CREATE NEW THREAD
    if (!thread) {

      thread = new Thread({

        userId: req.user.userId,   
        threadId,
        title: message,

        messages: [
          { role: "user", content: message }
        ]

      });

    } 
    
    // EXISTING THREAD
    else {

      thread.messages.push({
        role: "user",
        content: message
      });

    }


    const assistantReply = await getOpenAIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to process chat"
    });

  }

});

export default router;