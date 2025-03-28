const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/adminMiddleware");
const {
  addPlanType,
  deletePlanType,
  updatePlanType,
  addPlan,
  deletePlan,
  updatePlan,
  manageNetworks,
  fetchPlanTypes,
  fetchPlans,
  getAllNetworks,
} = require("../admin controllers/UpdateTelecomProviders");

router.get("/admin/getallnetworks", getAllNetworks);
router.put("/admin/update_network/:id", manageNetworks);

//ADDING< UPDATING & DELETING PLANTYPES API'S
router.get("/admin/plantypes", fetchPlanTypes);
router.post("/admin/add_plantype", addPlanType);
router.delete("/admin/delete_plantype/:id", deletePlanType);
router.put("/admin/update_plantype/:id", updatePlanType);

//ADDING, UPDATING & DELETING PLAN API'S
router.get("/admin/plans", fetchPlans);
router.post("/admin/add_plan", addPlan);
router.delete("/admin/delete_plan/:id", deletePlan);
router.put("/admin/update_plan/:id", updatePlan);

module.exports = router;
