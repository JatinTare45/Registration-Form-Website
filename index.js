const express=require("express");
const mongoose= require("mongoose");
const bodyParser= require("body-parser");
const dotEnv= require("dotenv");

const app=express();
dotEnv.config();

const port = process.env.PORT || 4545;

const name=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://jatintare92:${password}@cluster0.8lukozo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    tel:Number
});

const Registration= mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", (req,res) =>{
    res.sendFile(__dirname+"/pages/index.html")
})

app.post("/register",  async(req,res) => {
    try{
        const{name,email,password,tel}= req.body;

        const existingUser=await Registration.findOne({email:email});
        if(!existingUser){
            const registrationData=new Registration({
                name,
                email,
                password,
                tel
            });
            await registrationData.save();
            res.redirect("/Success");
        }
        else{
            console.log("User Already Exists");
            res.redirect("/Error")
        }
        
    }
    catch(error) {
        console.log(error);
        res.redirect("/Error");
    }
})

app.get("/Success", (req,res) => {
    res.sendFile(__dirname+"/pages/Success.html")
})
app.get("/Error", (req,res)=>{
    res.sendFile(__dirname+"/pages/Error.html")
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
