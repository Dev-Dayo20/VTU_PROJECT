const { Network, Plan, PlanType } = require("../models/Network");

const getNetworks = async (req, res) => {
  try {
    const networks = await Network.find({ status: "active" }).select(
      " networkId name status"
    );
    if (networks.length === 0) {
      return res.status(404).json({ error: "No active networks found" });
    }

    res.status(200).json({ success: true, data: networks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getPlanTypesByNetwork = async (req, res) => {
  const { networkId } = req.params;

  try {
    const network = await Network.findOne({
      networkId,
      status: "active",
    });
    if (!network) {
      return res.status(404).json({ error: "Network not found or inactive" });
    }

    const plantype = await PlanType.find({
      networkId: network._id,
      status: "active",
    })
      .populate("networkId")
      .select("name status");

    if (!plantype) {
      return res.status(404).json({
        error: `No active plan found for ${networkName}`,
      });
    }

    res.status(200).json({ success: true, data: plantype });
  } catch (error) {
    console.error("Error fetching plan types:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch plan types. Please try again." });
  }
};

const getPlansByTypes = async (req, res) => {
  const { plantype } = req.params;
  try {
    const type = await PlanType.findOne({ name: plantype, status: "active" });
    if (!type) {
      return res
        .status(404)
        .json({ error: "No plan type not found or inactive" });
    }

    const plans = await Plan.find({
      planTypeId: type._id,
      status: "active",
    }).populate("planTypeId");
    if (!plans.length) {
      return res.status(404).json({ error: "No Plans Found or Inactive" });
    }

    res.status(200).json({ success: true, plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Failed to fetch plans. Please try again." });
  }
};

module.exports = { getNetworks, getPlanTypesByNetwork, getPlansByTypes };
