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
app.get("/metaData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        pgClient.query("BEGIN;");
        const query1 = "SELECT username,email FROM users WHERE id=$1";
        const response1 = yield pgClient.query(query1, [id]);
        const query2 = "SELECT * FROM addresses WHERE user_id=$1";
        const response2 = yield pgClient.query(query2, [id]);
        pgClient.query("COMMIT;");
        res.json({
            user: response1.rows[0],
            addresses: response2.rows
        });
    }
    catch (e) {
        //@ts-ignore
        console.log("Error is : " + e.message);
        res.json({
            message: "Error while fetching data"
        });
    }
}));
// using joins
app.get("/better-metaData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        const joinsQuery = "SELECT users.username, users.email, addresses.city, addresses.country, addresses.street, addresses.pin_code FROM users JOIN addresses ON users.id=addresses.user_id WHERE users.id=$1";
        const response = yield pgClient.query(joinsQuery, [id]);
        res.json({
            response: response.rows
        });
    }
    catch (e) {
        //@ts-ignore
        console.log(e.message);
        res.json({
            message: "Error while fetching data"
        });
    }
}));
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
