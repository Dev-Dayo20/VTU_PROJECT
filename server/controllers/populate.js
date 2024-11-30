const { Network, PlanType, Plan } = require("../models/Network");

const populate = async (req, res) => {
  const { planId } = req.params;

  try {
    // const plan = await Plan.findOne({ planId, status: "active" }).populate({
    //   path: "planTypeId",
    //   populate: {
    //     path: "networkId",
    //     model: "Network",
    //   },
    // });

    const network = await Network.findOne({ name: planId });

    const planType = await PlanType.findOne({
      networkId: network._id,
      status: "active",
    }).populate({
      path: "planTypeId",
      match: { status: "active" },
    });
    res.status(200).json({ success: true, network, planType });
  } catch (error) {
    console.log(error);
  }
};

module.exports = populate;
