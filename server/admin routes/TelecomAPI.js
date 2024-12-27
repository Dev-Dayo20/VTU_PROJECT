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
} = require("../admin controllers/UpdateTelecomProviders");

//ADDING< UPDATING & DELETING PLANTYPES API'S
router.post("/admin/add_plantype", addPlanType);
router.delete("/admin/delete_plantype/:id", deletePlanType);
router.put("/admin/update_plantype/:id", updatePlanType);

//ADDING, UPDATING & DELETING PLAN API'S
router.post("/admin/add_plan", addPlan);
router.delete("/admin/delete_plan/:id", deletePlan);
router.put("/admin/update_plan/:id", updatePlan);

module.exports = router;
