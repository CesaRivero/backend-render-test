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
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.statusMessage = "Nota no encontrada";
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.delete("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        Note.findByIdAndDelete(request.params.id).then((note) => {
          response.status(204).end();
        });
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(400).send({ error: "malformatted id" });
    });
});
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      console.log(`Se modifico la nota ${request.params.id}
         ${updatedNote}`);
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }
  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
