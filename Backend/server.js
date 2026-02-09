const  express= require('express');
require('dotenv').config();
const mongoose=require("mongoose");
const chatRoutes=require('./routes/chat');


const cors =require('cors');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);


const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MongoDBURL);
    console.log("MongoDB Coonected");

    //connected to db
    app.listen(PORT,() => {
  console.log(`Server running on ${PORT}`);
  
});
  }
  catch(err){
    console.log("Failed to coonect to DB",err);
  }
};

connectDB();
/*app.post('/chat', async (req, res) => {
  const options={
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
  },
    body: JSON.stringify({
     model: "gemini-2.5-flash",
     message:[{
      role:"user",
      content:"Hello, how are you?"

     }]
    })
  };

  try{
    const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent/",options);
    const data=await response.json();
    console.log(data.choice[0].message);
    res.json(data.choice[0].message);
  }catch(err){
    console.log(err);
  }
});*/