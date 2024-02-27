// Loading and displaying ranking table
function loadRankingTable() {
    let users = [];
 
    // Obtaining users from localStorage
    for (let key of Object.keys(localStorage)) {
       // Parsing data and adding it into an array
       let usr = JSON.parse(localStorage[key]);
       users.push(usr);
    }
 
    // Sorting the ranking table
    users.sort((a, b) => b.highScore - a.highScore);
 
    // Generating a sorted table
    let str = "<table><tr><th>Name</th><th>Score</th></tr>";
    for (let usr of users) {
       str += "<tr><td>" + usr.username + "</td><td>" + usr.highScore + "</td></tr>";
    }
    str += "</table>";
 
    document.getElementById("Ranking").innerHTML = str;
 }
 
 // Loading and displaying rank in table
 window.onload = () => {
    loadRankingTable();
 };