import mongoose from "mongoose";

export const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "doctor",
    },
    appointmentTime: {
      type: String,
    },
    appointmentReason: {
      type: String,
    },
    patientName: {
      type: String,
    },
    patientEmail: {
      type: String,
    },
    policyId: {
      type: String,
    },
    fees: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  {
    collection: "appointment",
    timestamps: true,
  }
);

export const Appointment = mongoose.model("appointment", appointmentSchema);
