const NetworkData = require("./config/dataPlans.json");
const mongoose = require("mongoose");
const { Network, Plan, PlanType } = require("./models/Network");

async function bulkInsert() {
  try {
    await mongoose.connect("mongodb://localhost:27017/vtu_db", {});

    const data = [
      {
        networkId: "1",
        name: "MTN",
        PlanType: [
          {
            name: "SME",
            plans: [
              { name: "MTN 1.0 GB - 1 month", price: "261", planId: "7" },
              { name: "MTN 2.0 GB - 1 month", price: "522", planId: "8" },
              { name: "MTN 5.0 GB - 1 month", price: "1305", planId: "11" },
              { name: "MTN 500.0 MB - 1 month", price: "130", planId: "212" },
              { name: "MTN 3.0 GB - 1 month", price: "783", planId: "284" },
              { name: "MTN 10.0 GB - 1 month", price: "2610", planId: "285" },
              { name: "MTN 1.0 TB - 1 month", price: "259000", planId: "394" },
            ],
          },
          {
            name: "CORPORATE GIFTING",
            plans: [
              { name: "MTN 500MB - 1 month", price: "135", planId: "220" },
              { name: "MTN 1.024 GB - 1 month", price: "267", planId: "221" },
              { name: "MTN 2.048 GB - 1 month", price: "534", planId: "222" },
              { name: "MTN 5.12 GB - 1 month", price: "1335", planId: "224" },
              { name: "MTN 10.24 GB - 1 month", price: "2670", planId: "225" },
              { name: "MTN 3.072 GB - 1 month", price: "801", planId: "267" },
            ],
          },
        ],
      },
      {
        networkId: "4",
        name: "AIRTEL",
        PlanType: [
          {
            name: "CORPORATE GIFTING",
            plans: [
              { name: "AIRTEL 1.0 GB - 1 month", price: "280", planId: "247" },
              { name: "AIRTEL 2.0 GB - 1 month", price: "560", planId: "248" },
              { name: "AIRTEL 5.0 GB - 1 month", price: "1400", planId: "249" },
              {
                name: "AIRTEL 500.0 MB - 1 month",
                price: "150",
                planId: "255",
              },
              {
                name: "AIRTEL 10.0 GB - 1 month",
                price: "2800",
                planId: "311",
              },
              {
                name: "AIRTEL 300.0 MB - 1 month",
                price: "100",
                planId: "317",
              },
            ],
          },
          {
            name: "GIFTING",
            plans: [
              {
                name: "AIRTEL 10.0 GB - 1 month",
                price: "2050",
                planId: "447",
              },
              {
                name: "AIRTEL 15.0 GB - 1 month",
                price: "3050",
                planId: "451",
              },
              { name: "AIRTEL 4.0 GB - 1 month", price: "1050", planId: "468" },
            ],
          },
        ],
      },
      {
        networkId: "2",
        name: "GLO",
        PlanType: [
          {
            name: "CORPORATE GIFTING",
            plans: [
              { name: "GLO 1.0 GB - 1 month", price: "275", planId: "340" },
              { name: "GLO 2.0 GB - 1 month", price: "550", planId: "341" },
              { name: "GLO 3.0 GB - 1 month", price: "825", planId: "342" },
              { name: "GLO 5.0 GB - 1 month", price: "1375", planId: "343" },
              { name: "GLO 10.0 GB - 1 month", price: "2750", planId: "344" },
              { name: "GLO 500.0 MB - 1 month", price: "140", planId: "345" },
            ],
          },
        ],
      },
      {
        networkId: "3",
        name: "9MOBILE",
        PlanType: [
          {
            name: "CORPORATE GIFTING",
            plans: [
              { name: "9MOBILE 1.0 GB - 1 month", price: "150", planId: "430" },
              { name: "9MOBILE 2.0 GB - 1 month", price: "300", planId: "431" },
              { name: "9MOBILE 3.0 GB - 1 month", price: "450", planId: "432" },
              { name: "9MOBILE 4.0 GB - 1 month", price: "600", planId: "433" },
              { name: "9MOBILE 5.0 GB - 1 month", price: "750", planId: "435" },
              {
                name: "9MOBILE 500.0 MB - 1 month",
                price: "75",
                planId: "436",
              },
              { name: "9MOBILE 1.5 GB - 1 month", price: "220", planId: "437" },
              {
                name: "9MOBILE 10.0 GB - 1 month",
                price: "1500",
                planId: "438",
              },
              {
                name: "9MOBILE 15.0 GB - 1 month",
                price: "2250",
                planId: "439",
              },
            ],
          },
        ],
      },
    ];

    for (const networkData of data) {
      const network = await Network.create({
        networkId: networkData.networkId,
        name: networkData.name,
        status: "active",
      });

      for (const planTypeData of networkData.PlanType) {
        const planTypes = await PlanType.create({
          networkId: network._id,
          name: planTypeData.name,
          status: "active",
        });

        const plan = planTypeData.plans.map((plan) => ({
          planTypeId: planTypes._id,
          name: plan.name,
          price: Number(plan.price),
          planId: plan.planId,
          status: "active",
        }));
        await Plan.insertMany(plan);
      }
    }
    console.log("Bulk insertion completed");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error in bulk insertion:", error);
  }
}

bulkInsert();
