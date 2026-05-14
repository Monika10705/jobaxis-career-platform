require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const verifyData = async () => {
  try {
    await connectDB();

    // Get all employers
    const employers = await User.find({ role: 'employer' }).select('name email companyName companyLogo');
    console.log('\n=== EMPLOYERS ===');
    employers.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.companyName}`);
      console.log(`   Contact: ${emp.name} (${emp.email})`);
      console.log(`   Logo: ${emp.companyLogo}`);
      console.log('');
    });

    // Get all jobs with company info
    const jobs = await Job.find().populate('company', 'companyName companyLogo');
    console.log('=== JOBS ===');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Company: ${job.company.companyName}`);
      console.log(`   Type: ${job.type} | Category: ${job.category}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Salary: $${job.salaryMin?.toLocaleString()} - $${job.salaryMax?.toLocaleString()}`);
      console.log('');
    });

    console.log(`Total Employers: ${employers.length}`);
    console.log(`Total Jobs: ${jobs.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
};

verifyData();