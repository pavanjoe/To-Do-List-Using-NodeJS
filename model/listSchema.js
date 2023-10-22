
const mongoose = require("mongoose");
const listSchema = new mongoose.Schema({
    "name":{type:String}
},{
    collection:"tasks"
});

module.exports = mongoose.model("list", listSchema);