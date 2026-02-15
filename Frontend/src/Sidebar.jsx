import "./Sidebar.css"
import{useContext,useEffect} from "react";
import {MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";
function Sidebar(){
    const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);

    const getAllThreads=async()=>{
        try{
            const response=await fetch("https://ai-chat-bot-web-application.onrender.com/api/thread");
            const res=await response.json();
            const filterData=res.map(thread=>({threadId:thread.threadId , title:thread.title}));
            console.log(filterData);
            setAllThreads(filterData)
        }
        catch(e){
            console.log(e);
        }
        };
        useEffect(()=>{
            getAllThreads();
        },[currThreadId])
     
        const createNEwChat=()=>{
            setNewChat(true);
            setPrompt("");
            setReply(null);
            setCurrThreadId(uuidv1());
            setPrevChats([]);
        }

        const changeThread=async (newThreadId) =>{
            setCurrThreadId(newThreadId);

            try{
                const response=await fetch(`https://ai-chat-bot-web-application.onrender.com/api/thread/${newThreadId}`);
                const res=await response.json();
                setPrevChats(res);
                setNewChat(false); 

            }catch(err){
                console.log(err);
            }
        }
        const deleteThread=async(threadId)=>{
            try{
                const response=await fetch(`https://ai-chat-bot-web-application.onrender.com/api/thread/${threadId}`,{method:"DELETE"});
                const res=await response.json();
                console.log(res);

                //update all threads 
                setAllThreads(prev=>prev.filter(thread=>thread.threadId !==threadId));
            } catch(err){
                console.log(err);
        }
    }
    return(
    <section className="sidebar">
        {/*new chat buttom */}
        <button onClick={createNEwChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
        <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>
        {/*histry*/}
        <ul className="history">
            {
                allThreads.map((thread,idx)=>(
                    <li key={idx}
                         onClick={()=>changeThread(thread.threadId)}
                    >
                        {thread.title}
                        <i className="fa-solid fa-trash"
                        onClick={(e)=>{
                            e.stopPropagation();//stop event bubbling
                            deleteThread(thread.threadId);
                        }}
                        ></i>
                    </li>
                ))
            }
        </ul>

        {/*sign */}
        <div className="sign">
            <p>By Omprakash &hearts;</p>
        </div>
    </section>
    )
}

export default Sidebar;