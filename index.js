require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

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

//GET ALL PERSONS
app.get("/api/persons", async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

//GET INFO
app.get("/info", async (request, response) => {
  const today = new Date();
  const people = (await Person.find({})).length;
  response.send(`
    <p>Phonebook has info for ${people} people</p>
    <p>${today}</p>
  `);
});

//GET PERSON
app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      request.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

//DELETE PERSON
app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.sendStatus(204).end();
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const { name, number } = request.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

//POST - CREATE PERSON
app.post("/api/persons", async (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

//unknownEndpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

//Error handling
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatter id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

//SERVER
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
