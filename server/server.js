const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

PORT = process.env.PORT || 3000;
const app = express();

connectDB();
app.use(cors());
app.use(express.json());

// @desc routes
app.use("/devdplug", [
  require("./routes/auth"),
  require("./routes/walletRoutes"),
  require("./routes/payment_route"),
  require("./routes/webhookRoute"),
  require("./routes/historyRoutes"),
  require("./routes/walletRoutes"),
  require("./admin routes/adminAuth"),
]);

app.get("/payment-callback", (req, res) => {
  const { reference } = req.query;
  res.redirect(`/dashboard/payment-receipt/${reference}`);
  // console.log("Received callback for reference:", req.query.reference);
});

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173",
    changeOrigin: true,
    ws: true,
    // Don't proxy API routes
    filter: (pathname, req) => !pathname.startsWith("/devdplug"),
  })
);

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
