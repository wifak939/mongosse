// Import mongoose package
const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB using the URI stored in the .env file as MONGO_URI
mongoose.connect(process.env.MONGO_URI);

// Log connection success or error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

// Define the Person schema using mongoose.Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // name is required
  },
  age: Number,  // age is a number, optional
  favoriteFoods: [String],  // array of strings
});

// Create the Person model from the schema
const Person = mongoose.model('Person', personSchema);

/* --------------------
   Create and Save a Single Record
---------------------*/
const createAndSavePerson = (done) => {
  // Create a new person document
  const person = new Person({
    name: 'John Doe',
    age: 25,
    favoriteFoods: ['pizza', 'pasta'],
  });

  // Save the person to the database
  person.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

/* --------------------
   Create Many Records with model.create()
---------------------*/
const createManyPeople = (arrayOfPeople, done) => {
  // Create multiple people at once
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return done(err);
    done(null, people);
  });
};

/* --------------------
   Find all people with a given name using model.find()
---------------------*/
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => {
    if (err) return done(err);
    done(null, people);
  });
};

/* --------------------
   Find one person by favorite food using model.findOne()
---------------------*/
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return done(err);
    done(null, person);
  });
};

/* --------------------
   Find person by _id using model.findById()
---------------------*/
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    done(null, person);
  });
};

/* --------------------
   Find, edit, then save
   Add "hamburger" to favoriteFoods array
---------------------*/
const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  Person.findById(personId, (err, person) => {
    if (err) return done(err);

    // Add hamburger to favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // Save the updated person document
    person.save((err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

/* --------------------
   Perform new updates on a document using model.findOneAndUpdate()
   Set age to 20 for person with personName
---------------------*/
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true }, // Return the updated document
    (err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

/* --------------------
   Delete one document using model.findByIdAndRemove()
---------------------*/
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

/* --------------------
   Delete many documents using model.remove()
   Remove all people with name 'Mary'
---------------------*/
const removeManyPeople = (done) => {
  Person.remove({ name: 'Mary' }, (err, result) => {
    if (err) return done(err);
    done(null, result);
  });
};
/* --------------------
   Chain search query helpers
   Find people who like burritos, sort by name, limit 2, hide age, execute with callback
---------------------*/
const queryChain = (done) => {
  Person.find({ favoriteFoods: 'burritos' }) // find people who like burritos
    .sort({ name: 1 }) // sort ascending by name
    .limit(2) // limit results to 2
    .select('-age') // exclude age field
    .exec((err, data) => {
      if (err) return done(err);
      done(null, data);
    });
};

// Export all functions for testing or use in other files
module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
};