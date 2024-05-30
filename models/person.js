const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.mongoose);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Minimum 3 characters required"],
    required: [true, "Name is required"],
  },
  number: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [9, "Minimum 8 numbers required"],
    validate: {
      validator: function (v) {
        return /\d{3}-\d/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
