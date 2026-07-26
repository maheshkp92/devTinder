require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const ConnectionRequest = require("./models/connectionRequest");

(async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);

  const targetUserId = "6a6456d14c0dbe932a410696";
  const existingTarget = await User.findById(targetUserId);

  if (!existingTarget) {
    console.log("Target user not found");
    await mongoose.disconnect();
    process.exit(1);
  }

  const usersToCreate = [
    {
      firstName: "Naina",
      lastName: "Singh",
      emailId: `newuser${Date.now()}@example.com`,
      password: "New@12345",
      age: 28,
      gender: "female",
      about: "New test user for request flow.",
      skills: ["Node.js", "MongoDB", "Express"],
      photoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    },
    {
      firstName: "Karan",
      lastName: "Mehta",
      emailId: `newuser${Date.now() + 1}@example.com`,
      password: "Karan@12345",
      age: 30,
      gender: "male",
      about: "Another test user for request flow.",
      skills: ["React", "TypeScript", "Next.js"],
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    {
      firstName: "Sara",
      lastName: "Iqbal",
      emailId: `newuser${Date.now() + 2}@example.com`,
      password: "Sara@12345",
      age: 26,
      gender: "female",
      about: "Third test user for request flow.",
      skills: ["Python", "Django", "PostgreSQL"],
      photoUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
  ];

  const createdUsers = [];

  for (const userData of usersToCreate) {
    const createdUser = await User.create({
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
    });

    const existing = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: createdUser._id, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: createdUser._id },
      ],
    });

    if (!existing) {
      await ConnectionRequest.create({
        fromUserId: createdUser._id,
        toUserId: targetUserId,
        status: "interested",
      });
    }

    createdUsers.push({
      createdUserId: createdUser._id.toString(),
      emailId: userData.emailId,
      password: userData.password,
      targetUserId,
      requestCreated: !existing,
    });
  }

  console.log(JSON.stringify(createdUsers, null, 2));

  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
