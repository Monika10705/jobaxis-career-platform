require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const BASE_URL = 'http://localhost:8000';

const fixLogos = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.updateOne(
    { email: 'hr@techcorp.com' },
    { companyLogo: `${BASE_URL}/uploads/techcorp-logo.svg` }
  );

  await User.updateOne(
    { email: 'careers@innovatelabs.com' },
    { companyLogo: `${BASE_URL}/uploads/innovatelabs-logo.svg` }
  );

  console.log('Company logos updated successfully');
  process.exit(0);
};

fixLogos().catch(err => { console.error(err); process.exit(1); });
