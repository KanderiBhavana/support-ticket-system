const express = require("express");
const Ticket = require("../models/Ticket");

const router = express.Router();

router.post("/", async (req, res) => {
  const ticket = await Ticket.create(req.body);
  res.json(ticket);
});

router.get("/", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

router.get("/:id", async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  res.json(ticket);
});

router.put("/:id", async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(ticket);
});

module.exports = router;