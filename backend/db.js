const mongoose = require("mongoose");
const dns = require("dns");

// Fix for Node.js MongoDB DNS resolution issues on certain IPv6 networks
dns.setServers(["8.8.8.8", "2001:4860:4860::8888"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

