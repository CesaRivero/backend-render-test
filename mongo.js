const mongoose = require("mongoose");
if (process.argv.length < 3) {
  console.log("give password as argument");
}
const password = process.argv[2];
const url = `mongodb+srv://cesartomasrivero:${password}@cluster0.xbjz4.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);
// const note = new Note({
//   content: "Note from backend with mongoose",
//   important: false,
// });
// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });
Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
