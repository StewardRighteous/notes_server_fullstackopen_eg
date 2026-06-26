const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);
mongoose
  .connect(url, { family: 4 })
  .then((res) => console.log("Connected to Mongo"))
  .catch((err) => console.log("Error connecting to Mongo"));

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    requied: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

module.exports = mongoose.model("Note", noteSchema);
