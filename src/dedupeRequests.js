require("dotenv").config();
const mongoose = require("mongoose");
const ConnectionRequest = require("./models/connectionRequest");

(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);

  const requests = await ConnectionRequest.find({ status: "interested" })
    .sort({ createdAt: 1 })
    .lean();
  const seen = new Map();
  const toDelete = [];

  for (const req of requests) {
    const key = [req.fromUserId.toString(), req.toUserId.toString()]
      .sort()
      .join("::");
    if (seen.has(key)) {
      toDelete.push(req._id);
    } else {
      seen.set(key, req._id);
    }
  }

  if (toDelete.length > 0) {
    await ConnectionRequest.deleteMany({ _id: { $in: toDelete } });
  }

  console.log(
    JSON.stringify(
      { removedCount: toDelete.length, keptIds: Array.from(seen.values()) },
      null,
      2,
    ),
  );
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
