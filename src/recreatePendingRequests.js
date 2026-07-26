require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const ConnectionRequest = require("./models/connectionRequest");

(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);

  const targetUserId = "6a6456d14c0dbe932a410696";
  const users = await User.find({ emailId: { $regex: /^newuser/i } }).lean();

  const results = [];

  for (const user of users) {
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: user._id, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: user._id },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status !== "interested") {
        existingRequest.status = "interested";
        await existingRequest.save();
        results.push({
          userId: user._id.toString(),
          emailId: user.emailId,
          action: "updated-to-interested",
        });
      } else {
        results.push({
          userId: user._id.toString(),
          emailId: user.emailId,
          action: "already-interested",
        });
      }
    } else {
      await ConnectionRequest.create({
        fromUserId: user._id,
        toUserId: targetUserId,
        status: "interested",
      });
      results.push({
        userId: user._id.toString(),
        emailId: user.emailId,
        action: "created-interested",
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
