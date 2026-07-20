const mongoose = require('mongoose');
const dns = require('dns');

// Force Node's DNS resolver to use public DNS servers.
// Fixes "querySrv ECONNREFUSED" for mongodb+srv:// when the local/ISP
// DNS server refuses SRV lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;