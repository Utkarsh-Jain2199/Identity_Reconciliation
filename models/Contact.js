const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model("Counter", CounterSchema);

const ContactSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  phoneNumber: { type: String, default: null },
  email: { type: String, default: null },
  linkedId: { type: Number, default: null },
  linkPrecedence: { type: String, enum: ["primary", "secondary"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

ContactSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: "contactId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
