const mongoose = require("mongoose");

const NetworkSchema = new mongoose.Schema({
  networkId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Plan Type Schema
const PlanTypeSchema = new mongoose.Schema({
  networkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Network",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Plan Schema
const PlanSchema = new mongoose.Schema({
  planTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlanType",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const Network = mongoose.model("Network", NetworkSchema);
const PlanType = mongoose.model("PlanType", PlanTypeSchema);
const Plan = mongoose.model("Plan", PlanSchema);

module.exports = { Network, PlanType, Plan };
