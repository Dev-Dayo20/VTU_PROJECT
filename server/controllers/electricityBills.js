const axios = require("axios");
require("dotenv").config();

const electricityBills = async (req, res) => {
  const { disco, amount, meterNumber, meterType } = req.body;
  if (!disco || !amount || !meterNumber || !meterType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const data = {
    disco_id: disco,
    amount: amount,
    meter_number: meterNumber,
    meter_type: meterType,
  };

  const config = {
    method: "post",
    url: "https://www.gladtidingsdata.com/api/v2/billpayment/",
    headers: {
      Authorization: `Token ${process.env.GLADSTIDINGS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    console.log(
      "Received response from Ufardata:",
      JSON.stringify(response.data)
    );

    if (response.data.success) {
      console.log("Success response from Ufardata", response.data);
      return res.status(200).json({
        message: "Electricity bill payment successful!",
        data: response.data,
      });
    } else {
      console.log("Purchase failed", response.data);
      return res.status(400).json({
        error: "Failed to process payment. Please try again.",
        details: response.data,
      });
    }
  } catch (error) {
    console.error("Error occured while processing payment", error);

    if (error.response) {
      return res.status(error.response.status).json({
        error:
          "API Error: " +
          (error.response.data?.error || "Something went wrong."),
        details: error.response.data || error.message,
      });
    } else if (error.request) {
      // The request was made, but no response was received
      return res.status(500).json({
        error:
          "No response from server. Please check your network or try again later.",
        details: error.request,
      });
    } else {
      return res.status(500).json({
        error: "Unexpected error occured, please try again later",
        detals: error.message,
      });
    }
  }
};

module.exports = electricityBills;
