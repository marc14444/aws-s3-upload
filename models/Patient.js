import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

let patientSchema = mongoose.Schema({
  nomPatient: {
    type: String,
    required: [true, "Veuillez entrer votre nom !"],
  },
  prenomPatient: {
    type: String,
    required: [true, "Veuillez entrer votre prenom !"],
  },
  telPatient: {
    type: String,
    required: true,
    unique: true,
  },
  emailPatient: {
    type: String,
    required: [true, "Veuillez entrer votre email !"],
    unique: true,
  },
  passwordPatient: { type: String, required: true },
  rolePatient: { type: String, required: false, default: "patient" },
  statusPAtient: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
patientSchema.plugin(uniqueValidator);
export default patientSchema = mongoose.model("Patients", patientSchema);
