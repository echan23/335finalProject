const express = require('express');
const dotenv = require('dotenv').config();
const path = require("path");
const mongoose = require("mongoose");
const {Schema} = mongoose;
const app = express();
const PORT = 3000;
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);
//db stuff
mongoose.connect(process.env.MONGODB_URL,{
    dbName: process.env.MONGODB_DBNAME
});
mongoose.connection.on("connected", ()=>{
    console.log("Connectet to db");
});

//search, rest of endpoints are in routes
app.get("/search", async (req, res) => {
    const foodName = req.query.foodname;
    try{
        let url = `${process.env.API_URL}?food_name=${encodeURIComponent(foodName)}`;
        const response = await(fetch(url));
        const data = await response.json();
        res.json(data)

    } catch(err){
        console.log("Error retrieving data from API", err);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});