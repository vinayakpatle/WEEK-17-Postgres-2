import {Client} from "pg";
import express from "express";

const app=express();
app.use(express.json());

const pgClient=new Client("postgresql://neondb_owner:DjtWv2m0HVNZ@ep-plain-hat-a8sxotp9-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
pgClient.connect();

app.post("/signup",async (req,res)=>{
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;

    const city=req.body.city;
    const country=req.body.country;
    const street=req.body.street;
    const pin_code=req.body.pin_code;

    try{
        const insertQuery="INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id";
        const response=await pgClient.query(insertQuery,[username,email,password]);
        console.log(response);

        const user_id=response.rows[0].id;

        const insertAddressQuery="INSERT INTO addresses(city,country,street,pin_code,user_id) VALUES($1,$2,$3,$4,$5)";
        const responseAddress=await pgClient.query(insertAddressQuery,[city,country,street,pin_code,user_id]);

        res.json({
            message:"you have signed up successfully"
        })

    }catch(e){
        //@ts-ignore
        console.log("Error is : "+e.message);
        res.json({
            message:"There was erroe while signing up"
        })

    }


})

app.listen(3000,()=>{
    console.log("Server is runnig on port 3000");
})