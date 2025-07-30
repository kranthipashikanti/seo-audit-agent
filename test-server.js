import axios from 'axios';

// Test if server is running
const testServer = async () => {
  try {
    console.log('Testing server connection...');
    
    // Test a simple endpoint
    const response = await axios.post('http://localhost:3002/api/audit', {
      url: 'https://example.com'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Server is working!');
    console.log('Response status:', response.status);
    console.log('Has audit data:', !!response.data.score);
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 3002');
      console.log('Please run: npm run server');
    } else {
      console.log('⚠️ Server responded but with error:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data?.error || error.message);
    }
    process.exit(1);
  }
};

testServer();