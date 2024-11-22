import express from "express";
import axios from "axios";
import { Appointment } from "./db/models/Appointment.js";
import { pingMongodb } from "./db/index.js";

const app = express();
app.use(express.json({ limit: "20mb" }));

// Endpoint to create an appointment
app.post("/appointment", async (req, res) => {
  const {
    doctorId,
    appointmentTime,
    appointmentReason,
    policyId,
    patientName,
    patientEmail,
  } = req.body;

  try {
    const slotResp = await axios.post(
      `http://host.docker.internal:8080/api/v1/doctor/bookslot`,
      {
        timeSlot: appointmentTime,
        doctorId,
      }
    );

    const resData = slotResp.data;
    console.log(resData);
    if (!slotResp.data) {
      res.send(500).json({
        message: "Appointment Failed for given time slot",
      });
    }

    // if (!slot) {
    //   return res.status(400).json({ error: "Time slot not available" });
    // }

    const appointment = {
      doctorId,
      appointmentTime,
      appointmentReason,
      policyId,
      fees: resData?.appointmentDetails.fees,
      status: "Created",
      patientEmail,
      patientName,
    };

    // create an appointment
    await Appointment.insertMany([appointment]);

    const billingResp = await axios.post(
      `http://host.docker.internal:8080/api/v1/billing/generate`,
      {
        patientName,
        policyId,
        fees: resData?.appointmentDetails.fees,
      }
    );
    const { data } = billingResp.data;

    // Send Appointment successful email
    await axios.post(
      `http://host.docker.internal:8080/api/v1/mail/send-email`,
      {
        to: patientEmail,
        subject: "Booking Appointment Confirmed!",
        body: "Your appintment is confirmed",
      }
    );

    res.status(201).json({
      appointment,
      bill: {
        gst: data.gst,
        total: data.total,
      },
      status: "Appointment Created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error?.response?.data });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  await pingMongodb();
  console.log(`Server is running on port ${PORT}`);
});
