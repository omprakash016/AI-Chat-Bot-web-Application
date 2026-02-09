import "./ChatWindow.css"
import Chat from "./Chat.jsx";
import {MyContext} from "./MyContext.jsx";
import {useContext,useState,useEffect} from "react";
import{ScaleLoader} from "react-spinners";
function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats,setNewChat}=useContext(MyContext);
    const [loading,setLoading]=useState(false);
    const getReply=async()=>{
        setLoading(true);
        setNewChat(false);
       // const threadIdtoSend=currThreadId || `t_${new Date.now()}`;
        console.log("message sent:",prompt,"threadId:",currThreadId);
        const option={
        method:"POST",
        headers: {
            "content-type":"application/json"

        },
        body:JSON.stringify({
            message:prompt,
            threadId:currThreadId
        })
    };
    try{
       const response= await fetch("http://localhost:8080/api/chat",option);
       const res=await response.json();
       console.log(res);
       setReply(res.reply);
    }catch(error){
        console.log(error);
    }
    setLoading(false);
    }
    //append new chat  to prevchats
    useEffect(()=>{
        if(prompt && reply) {
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ))
 
        }
        setPrompt("");
    },[reply]);
    return(
        <div className="chatWindow">
            <div className="navbar">
                <span className="opgpt">OpGpt<i className="fa-solid fa-angle-down"></i></span>
             </div>
            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                     value={prompt}
                    onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key==='enter'?getReply():''}
                    >
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-circle-arrow-right"></i></div>
                </div>
                <p className="info">
                    OpGpt can make mistakes.Check important information.See cookie Preference.
                </p>
              </div>    
         </div>

    )

}

export default ChatWindow;