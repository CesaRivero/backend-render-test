require("dotenv").config();
console.log(`PORT desde env: ${process.env.PORT}`); // Para verificar que se carga
console.log("MongoDB URI desde env:", process.env.MONGODB_URI);

const express = require("express");
const cors = require("cors");
const Note = require("./models/note");
const app = express();
app.use(express.json());

// let notes = [
//   {
//     id: 1,
//     content: "Nota dentro del backend",
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
// ];
app.use(cors());
app.use(express.static("dist"));
app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id);
    return note.id === id;
  });
  console.log(note);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "Nota no encontrada";
    response.status(404).end();
  }
});
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };
  notes = notes.concat(note);
  console.log(note);
  response.json(note);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
