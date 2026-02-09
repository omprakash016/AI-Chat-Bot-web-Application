const express = require('express');
const Thread = require("../models/Thread");
const getOpenAIResponse = require('../utils/openai');

const router=express.Router();

//test
router.get("/test",(req,res)=>{
    res.json({message:"API is working"});
});

//get all threads
 router.get("/thread",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});
        //this give us descending order of UpdatedAt..most recent data on top
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch threads"});
    }
 });

 router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params
    try{
        const thread = await Thread.findOne({ threadId: threadId });
        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch chats"});    
    }
 });

 router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
       const deletedThread= await Thread.findOneAndDelete({threadId:threadId});
       if(!deletedThread){
        res.status(404).json({error:"Thread not Found"});
       }

       res.status(200).json({success:"thread deleted successfully"})

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete thread"});
    }
 });

 //post route it is our main route

 router.post("/chat",async(req,res)=>
{
    const {threadId,message}=req.body;
    if(!threadId || !message){
        res.status(400).json({error:"Invalid request"});
    }
        try{
            let thread=await Thread.findOne({threadId:threadId});
             if(!thread){
                //create new thread in database
                thread=new Thread({
                    threadId:threadId,
                    title:message,
                    messages:[{role:"user",content:message}]
                });
             }
            else{
                //update existing thread
                thread.messages.push({role:"user",content:message});
             }
             const assistantReply=await getOpenAIResponse(thread.messages);
             thread.messages.push({role:"assistant",content:assistantReply});
             thread.updatedAt=new Date();

             await thread.save();
             console.log("sending reply:",assistantReply);
             res.json({reply:assistantReply});
        }catch(err) {
            console.log(err);
            if(err.code===11000){
                return res.status(409).json({error:"Duplicate threadId",details:err.keyValue});
            }
              console.error("❌ Error in /chat route:", err.message);
             console.error(err.stack);
            res.status(500).json({ error: err.message });
        }
        
    
}
);
module.exports=router;