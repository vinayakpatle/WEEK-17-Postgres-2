import {Client} from "pg";
import express from "express";

const app=express();
app.use(express.json());

const pgClient=new Client("postgresql://neondb_owner:DjtWv2m0HVNZ@ep-plain-hat-a8sxotp9-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
pgClient.connect();

app.get("/metaData",async (req,res)=>{
    const id=req.query.id;

    try{

        pgClient.query("BEGIN;");

        const query1="SELECT username,email FROM users WHERE id=$1";
        const response1=await pgClient.query(query1,[id]);

        const query2="SELECT * FROM addresses WHERE user_id=$1";
        const response2=await pgClient.query(query2,[id]);

        pgClient.query("COMMIT;");

        res.json({
            user:response1.rows[0],
            addresses:response2.rows
        })
    }catch(e){
        //@ts-ignore
        console.log("Error is : "+e.message);
        res.json({
            message:"Error while fetching data"
        })
    }

})

// using joins
app.get("/better-metaData",async(req,res)=>{
    const id=req.query.id;

    try{
        const joinsQuery="SELECT users.username, users.email, addresses.city, addresses.country, addresses.street, addresses.pin_code FROM users JOIN addresses ON users.id=addresses.user_id WHERE users.id=$1";

        const response=await pgClient.query(joinsQuery,[id]);

        res.json({
            response:response.rows
        })
    }catch(e){
        //@ts-ignore
        console.log(e.message);
        res.json({
            message:"Error while fetching data"
        })
    }
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})