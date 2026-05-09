const axios = require('axios');
const io = require('socket.io-client');

const API_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING TESTS ---\n');
  
  let expertId;
  const email = 'test@example.com';
  const date = '2026-05-15';
  const slot = '10:00 AM';

  // Test 1: Fetch Experts
  console.log('Test 1: Fetching Experts');
  try {
    const res = await axios.get(`${API_URL}/experts`);
    console.log('✅ Experts fetched successfully.');
    console.log(`Found ${res.data.data.length} experts.`);
    expertId = res.data.data[0]._id;
  } catch (err) {
    console.error('❌ Failed to fetch experts:', err.message);
  }

  // Test 2: Fetch Specific Expert
  console.log('\nTest 2: Fetching Specific Expert Details');
  try {
    const res = await axios.get(`${API_URL}/experts/${expertId}`);
    console.log('✅ Expert details fetched successfully for:', res.data.data.name);
  } catch (err) {
    console.error('❌ Failed to fetch expert details:', err.message);
  }

  // Setup Socket listener for Test 3 & 4
  const socket = io(API_URL);
  let socketEventReceived = false;
  socket.on('slotBooked', (data) => {
    socketEventReceived = true;
    console.log('\n✅ Real-time Socket Event Received!');
    console.log('Event Data:', data);
  });

  // Wait a moment for socket connection
  await new Promise(r => setTimeout(r, 500));

  // Test 3: Create Booking
  console.log('\nTest 3: Creating a new Booking');
  try {
    const res = await axios.post(`${API_URL}/bookings`, {
      expertId,
      name: 'Test User',
      email,
      phone: '1234567890',
      date,
      slot,
      notes: 'Testing'
    });
    console.log('✅ Booking created successfully:', res.data.data._id);
  } catch (err) {
    console.error('❌ Failed to create booking:', err.response?.data?.message || err.message);
  }

  // Wait for socket event
  await new Promise(r => setTimeout(r, 500));
  if (!socketEventReceived) {
    console.error('❌ Did not receive slotBooked socket event!');
  }

  // Test 4: Booking Conflict
  console.log('\nTest 4: Creating a conflicting Booking (Same Slot)');
  try {
    await axios.post(`${API_URL}/bookings`, {
      expertId,
      name: 'Conflict User',
      email: 'conflict@example.com',
      phone: '0987654321',
      date,
      slot,
      notes: 'Testing Conflict'
    });
    console.error('❌ Conflict test failed! The booking was allowed.');
  } catch (err) {
    console.log('✅ Conflict successfully prevented! Server responded with:', err.response?.data?.message);
  }

  // Test 5: Fetch Bookings by Email
  console.log('\nTest 5: Fetch Bookings by Email');
  try {
    const res = await axios.get(`${API_URL}/bookings`, { params: { email } });
    console.log(`✅ Fetched ${res.data.data.length} bookings for ${email}.`);
  } catch (err) {
    console.error('❌ Failed to fetch bookings by email:', err.message);
  }

  console.log('\n--- ALL TESTS COMPLETED ---');
  process.exit(0);
}

runTests();
