const os = require('os');

// Get system architecture
console.log('Architecture:', os.arch());

// Get operating system platform
console.log('Platform:', os.platform());

// Get total system memory
console.log('Total Memory:', os.totalmem());

// Get free system memory
console.log('Free Memory:', os.freemem());

// Get system uptime (in seconds)
console.log('Uptime:', os.uptime());

// Get user info
console.log('User Info:', os.userInfo());

// Get network interfaces
console.log('Network Interfaces:', os.networkInterfaces());

