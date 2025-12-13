const submitSelectedFoods = async (e) => {
    e.preventDefault()
    const itemSelect = document.getElementById("itemSelect");
    const selectedIndexes = Array.from(itemSelect.selectedOptions).map(e => Number(e.value));
    const selectedItems = selectedIndexes.map(i => data[i]);

    const response = await fetch("/addFoods", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({items: selectedItems})
    });
    if(!response.ok){
        console.log("Error POSTing new foods to DB");
    }
}   

const inputForm = document.querySelector(".inputForm");
let data = []
inputForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    
    const foodName = document.getElementById("kwInput").value.trim();
    if(!foodName) return;
    
    const response = await(fetch(`/search?foodname=${foodName}`));
    data = await(response.json());

    if(data.length == 0){
        document.getElementById("display").innerHTML = `<span>No items found that match input</span>`;
        return;
    }
    
    let displayHTML = `<form id="selectForm"><select id="itemSelect" multiple size="6">`;
    data.forEach((item, index) => {
        displayHTML += `<option value=${index}>${item.name}</option>`
    })
    displayHTML += `</select><button type="submit">Add to meal totals</button></form>`;
    document.getElementById("display").innerHTML = displayHTML;
    
    const selectForm = document.getElementById("selectForm");
    selectForm.addEventListener("submit", submitSelectedFoods);
})

const getTotalNutrition = async () => {
    console.log("getting nutrition totals");
    try{
        const response = await fetch("/viewTotals");
        const data = await response.text();
        document.getElementById("showTotalsContainer").innerHTML = data;
    } catch (err){
        console.log("Error getting nutrition totals,", err);
    }
}

const resetSelectedFoods = async () => {
    try{
        const response = await fetch("/resetSelectedFoods", {method:"DELETE"});
        if(!response.ok){
            alert("Error resetting selected foods");
            return;
        }
        alert("Selected foods have been reset");
    }catch(err){
        console.log("error resetting selected foods", err);
    }
}
