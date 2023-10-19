const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const options = { weekday: 'long', month: 'long', day: 'numeric' };
let today = new Date().toLocaleDateString('en-US', options);

let newItems = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { today: today, newItem: newItems });
});

app.post("/", (req, res) => {
  let newItem = req.body.newItem;
  newItems.push(newItem);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const itemIndex = req.body.itemIndex;
  if (itemIndex >= 0 && itemIndex < newItems.length) {
    newItems.splice(itemIndex, 1);
  }
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Port is running at 3000");
});
