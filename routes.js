const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {Schema} = mongoose;

const schema = new Schema({
    name: {type: String, required:true},
    calories: Number,
    protein: Number,
    total_fat: Number,
    carbs: Number,
    sodium: Number,
    sugar: Number,
    serving_size: String,
    location: String
});
const FoodObject = mongoose.model("Food", schema)


router.post("/addFoods", async (req, res) => {
    try{
        const items = req.body.items;
        await FoodObject.insertMany(items, {ordered: false});
        console.log(`inserted ${items.length} items`);
        res.status(201).json({})
    }catch(err){
        console.log("Error inserting into mongodb", err);
        res.status(500).json({"error": err.message})
    }
})

router.get("/viewTotals", async(req, res) =>{
    try{
        const data = await FoodObject.find();
        let totals = {calories: 0, protein: 0, total_fat: 0, carbs: 0, sodium: 0, sugar: 0};
        let resHTML = `<h3 class="center">Totals</h3><table border="1"> <thead><tr>
                            <th>Name</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Total Fat</th>
                            <th>Carbs</th>
                            <th>Sodium</th>
                            <th>Sugar</th>
                            <th>Serving Size</th>
                            <th>Location</th>
                        </tr></thead><tbody>`;
        data.forEach(e => {
            totals.calories += e.calories || 0;
            totals.protein += e.protein || 0;
            totals.total_fat += e.total_fat || 0;
            totals.carbs += e.carbs || 0;
            totals.sodium += e.sodium || 0;
            totals.sugar += e.sugar || 0;
            resHTML += `<tr>
                        <td>${e.name ?? ""}</td>
                        <td>${e.calories ?? ""}</td>
                        <td>${e.protein ?? ""}</td>
                        <td>${e.total_fat ?? ""}</td>
                        <td>${e.carbs ?? ""}</td>
                        <td>${e.sodium ?? ""}</td>
                        <td>${e.sugar ?? ""}</td>
                        <td>${e.serving_size ?? ""}</td>
                        <td>${e.location ?? ""}</td>            
                        </tr>`});
        resHTML += `<tr><td>Totals</td>
                    <td>${Math.round(totals.calories)}</td>
                    <td>${Math.round(totals.protein)}</td>
                    <td>${Math.round(totals.total_fat)}</td>
                    <td>${Math.round(totals.carbs)}</td>
                    <td>${Math.round(totals.sodium)}</td>
                    <td>${Math.round(totals.sugar)}</td>
                    <td></td><td></td></tr>`
        resHTML += "</tbody></table>";
        res.send(resHTML);
    } catch(err){
        console.log("Error retrieving food items from mongodb", err);
        res.status(500).json({"error": err.message})
    }
});

router.delete("/resetSelectedFoods", async (req, res) => {
    try{
        await FoodObject.deleteMany({});
        res.status(200).json({})
    }catch(err){
        console.log("Error deleting selected foods from mongodb", err);
        res.status(500).json({"error": err.message})
    }
})

module.exports = router;