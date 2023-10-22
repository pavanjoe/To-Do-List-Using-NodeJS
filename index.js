const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://pavanjoe123:Valummel123@cluster0.u5wr4kc.mongodb.net/");

const itemSchema = {
  name:String
}

const Item = mongoose.model("Item", itemSchema);

// const item1 = new Item({     
//   name:"Welcome to you ToDoList!"
// })

// const item2 = new Item({
//   name:"Click + to add a new item!"
// })

// const item3 = new Item({
//   name:"Click checkbox to mark it off and delete to remove task!"
// })

// const defaultItems = [item1, item2, item3]; //These items you can add as default if required

const addItems = [];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

const options = { weekday: 'long', month: 'long', day: 'numeric' };
let today = new Date().toLocaleDateString('en-US', options);

app.get("/", (req, res) => {
  Item.find({})
  .then((foundItems) => {
  //   if (foundItems.length === 0) {
  //     Item.insertMany(defaultItems)
  //     .then(function (result) {
  //       console.log("Insertion successful");
  //     })
  //     .catch(function (err) {
  //       console.error("Error during insertion:", err);
  //     });
  //     res.redirect("/");
  //   }
  //   else {
      res.render("index.ejs", { title: today, newItem: foundItems });
    // }
  })
  .catch((err) => {
    console.error(err);
  });
});


app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        console.log("List doesn't exist");
        const list = new List({
          name: customListName,
          items: addItems
        });
        list.save();
        res.redirect("/"+customListName);
      } else {
        res.render("index.ejs", { title: customListName, newItem: foundList.items });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});


app.post("/", (req, res) => {
  let newItem = req.body.newItem;
  let listName = req.body.list;

  const item = new Item ({
    name:newItem
  });

  if (listName === today) {
    item.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: listName})
    .then((foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
    .catch((err) => {
      console.log(err);
    })
  }
});

app.post("/delete", (req, res) => {
  const itemId = req.body.ObjectID;
  const listName = req.body.listName;

  if (listName === today) {
    Item.findByIdAndRemove(itemId)
      .then((deletedItem) => {
        if (deletedItem) {
          console.log("Successfully deleted the item.");
        } else {
          console.log("Item not found or already deleted.");
        }
        res.redirect("/");
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/");
      });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemId } } })
      .then((foundList) => { 
        res.redirect("/"+listName);
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/");
      });
  }
});



app.listen(3000, () => {
  console.log("Port is running at 3000");
});
