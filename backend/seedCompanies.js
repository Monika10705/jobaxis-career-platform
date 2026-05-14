require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const seedCompaniesAndJobs = async () => {
  try {
    await connectDB();

    // Create TechCorp employer
    const techCorpUser = new User({
      name: 'Sarah Johnson',
      email: 'hr@techcorp.com',
      password: 'password123',
      role: 'employer',
      companyName: 'TechCorp Solutions',
      companyDescription: 'Leading technology solutions provider specializing in cloud infrastructure and AI-powered applications.',
      companyLogo: '/src/assets/techcorp-logo.svg',
      isEmailVerified: true
    });

    const savedTechCorp = await techCorpUser.save();
    console.log('TechCorp employer created');

    // Create InnovateLabs employer
    const innovateLabsUser = new User({
      name: 'Michael Chen',
      email: 'careers@innovatelabs.com',
      password: 'password123',
      role: 'employer',
      companyName: 'InnovateLabs',
      companyDescription: 'Cutting-edge research and development company focused on sustainable technology and green energy solutions.',
      companyLogo: '/src/assets/innovatelabs-logo.svg',
      isEmailVerified: true
    });

    const savedInnovateLabs = await innovateLabsUser.save();
    console.log('InnovateLabs employer created');

    // Create jobs for TechCorp
    const techCorpJobs = [
      {
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience with React, Node.js, and MongoDB. Strong knowledge of JavaScript, HTML, CSS. Experience with cloud platforms (AWS/Azure). Excellent problem-solving skills.',
        location: 'San Francisco, CA',
        category: 'Engineering',
        type: 'Full-Time',
        company: savedTechCorp._id,
        salaryMin: 120000,
        salaryMax: 160000
      },
      {
        title: 'DevOps Engineer',
        description: 'Join our infrastructure team to build and maintain scalable cloud solutions. You will work with cutting-edge technologies to ensure our systems are reliable and efficient.',
        requirements: '3+ years of DevOps experience. Proficiency with Docker, Kubernetes, and CI/CD pipelines. Experience with AWS or Azure. Knowledge of Infrastructure as Code (Terraform/CloudFormation). Strong scripting skills in Python or Bash.',
        location: 'Remote',
        category: 'IT & Software',
        type: 'Remote',
        company: savedTechCorp._id,
        salaryMin: 100000,
        salaryMax: 140000
      }
    ];

    // Create jobs for InnovateLabs
    const innovateLabsJobs = [
      {
        title: 'Research Scientist - AI/ML',
        description: 'Lead groundbreaking research in artificial intelligence and machine learning for sustainable technology applications. Work on innovative projects that make a real impact on environmental challenges.',
        requirements: 'PhD in Computer Science, AI, or related field. 3+ years of research experience in ML/AI. Publications in top-tier conferences. Experience with TensorFlow, PyTorch. Strong mathematical background. Passion for sustainability.',
        location: 'Boston, MA',
        category: 'Engineering',
        type: 'Full-Time',
        company: savedInnovateLabs._id,
        salaryMin: 140000,
        salaryMax: 180000
      },
      {
        title: 'Product Manager - Green Tech',
        description: 'Drive product strategy and development for our green technology initiatives. Work closely with engineering and research teams to bring innovative sustainable solutions to market.',
        requirements: '5+ years of product management experience. Background in clean technology or sustainability. Strong analytical and communication skills. Experience with Agile methodologies. MBA preferred but not required.',
        location: 'Austin, TX',
        category: 'Product',
        type: 'Full-Time',
        company: savedInnovateLabs._id,
        salaryMin: 110000,
        salaryMax: 150000
      }
    ];

    // Insert all jobs
    await Job.insertMany([...techCorpJobs, ...innovateLabsJobs]);
    console.log('Jobs created successfully');

    console.log('\n=== Seeding Complete ===');
    console.log('Companies added:');
    console.log('1. TechCorp Solutions (hr@techcorp.com)');
    console.log('2. InnovateLabs (careers@innovatelabs.com)');
    console.log('Total jobs added: 4');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedCompaniesAndJobs();