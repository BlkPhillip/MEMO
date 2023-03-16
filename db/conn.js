const mongoose = require("mongoose");

async function main() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
      "mongodb+srv://filipecalmeida:K20HondaCivicEG4@cluster0.g22kze9.mongodb.net/?retryWrites=true&w=majority"
    );

    console.log("Conn Db ok!");
  } catch (error) {
    console.log(`Erro: ${error}`);
  }
}

module.exports = main;
