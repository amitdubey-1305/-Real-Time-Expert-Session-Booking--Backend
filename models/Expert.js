const mongoose = require("mongoose");
const expertSchema = new mongoose.Schema({
    name: String,
    category: String,
    experience: Number,
    rating: Number,
    slots: [
        {
            date: String,
            times: [String],
        },
    ],
});
module.exports = mongoose.model("Expert", expertSchema);