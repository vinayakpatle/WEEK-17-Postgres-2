"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pgClient = new pg_1.Client("postgresql://neondb_owner:DjtWv2m0HVNZ@ep-plain-hat-a8sxotp9-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
pgClient.connect();
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pin_code = req.body.pin_code;
    try {
        const insertQuery = "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id";
        const response = yield pgClient.query(insertQuery, [username, email, password]);
        console.log(response);
        const user_id = response.rows[0].id;
        const insertAddressQuery = "INSERT INTO addresses(city,country,street,pin_code,user_id) VALUES($1,$2,$3,$4,$5)";
        const responseAddress = yield pgClient.query(insertAddressQuery, [city, country, street, pin_code, user_id]);
        res.json({
            message: "you have signed up successfully"
        });
    }
    catch (e) {
        //@ts-ignore
        console.log("Error is : " + e.message);
        res.json({
            message: "There was erroe while signing up"
        });
    }
}));
app.listen(3000, () => {
    console.log("Server is runnig on port 3000");
});
