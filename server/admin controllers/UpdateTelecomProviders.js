const { Network, PlanType, Plan } = require("../models/Network");

//FETCH PLANTYPES LOGIC
const fetchPlanTypes = async (req, res) => {
  try {
    const plantypes = await PlanType.find({}).populate({ path: "networkId" });
    res.status(200).json({ success: true, data: plantypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//FETCH PLANS LOGIC
const fetchPlans = async (req, res) => {
  try {
    const plans = await Plan.find({}).populate({
      path: "planTypeId",
      populate: {
        path: "networkId",
      },
    });
    if (!plans) {
      return res.status(400).json({ error: "No plans found" });
    }
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//MANAGING NETWORKS LOGIC
const getAllNetworks = async (req, res) => {
  try {
    const allNetworks = await Network.find({});
    if (!allNetworks) {
      return res.status(404).json({ error: "No network found" });
    }
    res.status(200).json({ success: true, data: allNetworks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const manageNetworks = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  if (!id || !status || !reason) {
    return res.status(404).json({ error: "All fields are required" });
  }
  try {
    const updateNetworkStatus = await Network.findByIdAndUpdate(
      id,
      { status, reason },
      { new: true, runValidators: true }
    );
    if (!updateNetworkStatus) {
      return res
        .status(400)
        .json({ success: false, error: "Network not found" });
    }
    res.status(200).json({ success: true, data: updateNetworkStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error. " });
  }
};

//ADDING, UPDATING & DELETING PLANTYPES
const addPlanType = async (req, res) => {
  const { networkId, name, status } = req.body;

  if (!networkId || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const network = await Network.findOne({ _id: networkId });
    if (!network) {
      return res
        .status(404)
        .json({ success: false, error: "Network not found" });
    }

    const existingPlanType = await PlanType.findOne({ networkId, name });
    if (existingPlanType) {
      return res.status(400).json({
        success: false,
        message: `Plan type "${name}" already exists for the selected network.`,
      });
    }

    const newPlanType = await PlanType.create({ networkId, name, status });
    res.status(201).json({ success: true, data: newPlanType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", error });
  }
};

const deletePlanType = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "PlanType ID is required" });
  }

  try {
    const planType = await PlanType.findByIdAndDelete(id);
    if (!planType) {
      return res
        .status(404)
        .json({ success: false, message: "PlanType not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "PlanType deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", error });
  }
};

const updatePlanType = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  if (!name || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const planType = await PlanType.findById(id);
    if (!planType) {
      return res
        .status(404)
        .json({ success: false, message: "PlanType not found" });
    }

    const updatedPlanType = await PlanType.findByIdAndUpdate(
      id,
      { name, status },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedPlanType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", error });
  }
};

//ADDING, UPDATING & DELETING PLANS LOGIC
const addPlan = async (req, res) => {
  const { planTypeId, name, price, planId, status } = req.body;
  if (!planTypeId || !name || !price || !planId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const planType = await PlanType.findById(planTypeId);
  if (!planType) {
    return res.status(404).json({ error: "Plan Type Not Found" });
  }

  const existingPlan = await Plan.findOne({ planTypeId, planId });
  if (existingPlan) {
    return res
      .status(400)
      .json({ error: `Plan with ${planId} already exists` });
  }

  try {
    const plan = await Plan.create({ planTypeId, name, price, planId, status });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const deletePlan = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Plan ID is required" });
  }

  try {
    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ success: false, error: "Plan not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, price, planId, status } = req.body;

  try {
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { name, price, planId, status },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getAllNetworks,
  fetchPlans,
  fetchPlanTypes,
  manageNetworks,
  addPlanType,
  deletePlanType,
  updatePlanType,
  addPlan,
  deletePlan,
  updatePlan,
};
