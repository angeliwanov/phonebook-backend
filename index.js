const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

//MIDDLEWARE JSON
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

//MIDDLEWARE MORGAN POST REQUESTS CONFIG
morgan.token("postData", (request) => {
  if (request.method == "POST") return " " + JSON.stringify(request.body);
  else return " ";
});

//MIDDLEWARE ALL REQUESTS CONFIG
app.use(morgan(":method :url :response-time ms :postData"));

//LOCAL DB
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//GET ALL PERSONS
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//GET INFO
app.get("/info", (request, response) => {
  const today = new Date();
  const people = persons.length;
  response.send(`
    <p>Phonebook has info for ${people} people</p>
    <p>${today}</p>
  `);
});

//GET PERSON
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//DELETE PERSON
app.delete("/api/persons/:id", (request, respons) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  respons.sendStatus(204).end();
});

//POST - CREATE PERSON
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 10000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

//SERVER
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
