const mongoose = require('mongoose');

// Définir le schéma de la personne
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

// Créer le modèle
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
const Person = require('./models/Person');

// Créer une instance
const personne = new Person({
  name: 'Ali',
  age: 30,
  favoriteFoods: ['pasta', 'pizza']
});

// Enregistrer la personne
personne.save((err, data) => {
  if (err) return console.error(err);
  console.log('✔️ Personne enregistrée :', data);
});