require("dotenv").config();
const express = require("express");
const Note = require("./models/note");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/api/notes/:id", (req, resp, next) => {
  Note.findById(req.params.id)
    .then((note) => (note ? resp.json(note) : resp.status(404).end()))
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (req, resp, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, resp, next) => {
  const { content, important } = req.body;
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return resp.status(404).end;
      }
      note.content = content;
      note.important = important;
      return note.save().then((updatedNote) => resp.json(updatedNote));
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (req, resp, next) => {
  const body = req.body;

  if (!body.content) {
    return resp.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => resp.json(savedNote))
    .catch((err) => next(err));
});

app.get("/", (req, resp) => resp.send("<h1>Hello World </h1>"));

app.get("/api/notes", (req, resp) =>
  Note.find({}).then((notes) => resp.json(notes)),
);

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));
