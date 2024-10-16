const crypto = require("crypto");
require("dotenv").config();

const secret = process.env.PAYSTACK_SECRET_KEY;

const body = JSON.stringify({
  event: "charge.success",
  data: {
    reference: "11uyzcxak6",
    amount: 100000,
    customer: {
      email: "devdplug@yahoo.com",
    },
  },
});

// Generate the hash using HMAC-SHA512
const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

console.log("Generated Signature:", hash);
