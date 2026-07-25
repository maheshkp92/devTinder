require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

const seedUsers = async () => {
  await connectDB();

  const users = [
    {
      firstName: 'Aarav',
      lastName: 'Sharma',
      emailId: 'aarav@example.com',
      password: 'Aa@12345',
      age: 27,
      gender: 'male',
      about: 'Full-stack developer who loves React and Node.js.',
      skills: ['JavaScript', 'React', 'Node.js'],
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    {
      firstName: 'Meera',
      lastName: 'Patel',
      emailId: 'meera@example.com',
      password: 'Mm@12345',
      age: 24,
      gender: 'female',
      about: 'UI engineer focused on design systems and accessibility.',
      skills: ['TypeScript', 'UI/UX', 'CSS'],
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    {
      firstName: 'Rahul',
      lastName: 'Verma',
      emailId: 'rahul@example.com',
      password: 'Rr@12345',
      age: 29,
      gender: 'male',
      about: 'Backend engineer building scalable APIs and microservices.',
      skills: ['Node.js', 'MongoDB', 'AWS'],
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    },
    {
      firstName: 'Priya',
      lastName: 'Nair',
      emailId: 'priya@example.com',
      password: 'Pp@12345',
      age: 26,
      gender: 'female',
      about: 'Product-minded developer who enjoys Python and data tools.',
      skills: ['Python', 'SQL', 'Data Science'],
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
  ];

  for (const user of users) {
    const existingUser = await User.findOne({ emailId: user.emailId });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: passwordHash });
    }
  }

  console.log('Seeded sample users successfully');
  await mongoose.disconnect();
};

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
