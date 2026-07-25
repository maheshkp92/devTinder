require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const ConnectionRequest = require("./models/connectionRequest");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

const seedConnections = async () => {
  await connectDB();

  const users = await User.find({}).lean();
  if (users.length < 2) {
    console.log("Need at least 2 users in the database first.");
    await mongoose.disconnect();
    return;
  }

  const pairs = [
    [users[0]._id, users[1]._id],
    [users[0]._id, users[2] ? users[2]._id : users[1]._id],
    [users[1]._id, users[3] ? users[3]._id : users[0]._id],
  ];

  for (const [fromId, toId] of pairs) {
    const existing = await ConnectionRequest.findOne({
      fromUserId: fromId,
      toUserId: toId,
    });
    if (!existing) {
      await ConnectionRequest.create({
        fromUserId: fromId,
        toUserId: toId,
        status: "accepted",
      });
    }
  }

  console.log("Seeded sample accepted connections successfully");
  await mongoose.disconnect();
};

seedConnections().catch((err) => {
  console.error(err);
  process.exit(1);
});
