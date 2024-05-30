const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as agrument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://angeliwanov:${password}@cluster0.w5bdlyv.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

console.log("connected to db");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log("phonebook saved");
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
