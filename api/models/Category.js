const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true },
  sort: { type: Number }
});

mongoose.model("category", categorySchema);
