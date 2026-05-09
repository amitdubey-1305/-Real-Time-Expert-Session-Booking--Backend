const mongoose = require('mongoose');
const Expert = require('./models/Expert');

mongoose.connect('mongodb://127.0.0.1:27017/expert-session')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear the current database first
    await Expert.deleteMany({});
    console.log('Cleared existing experts');

    const expertsToInsert = [
      {
        name: 'Jane Doe',
        category: 'Web Development',
        experience: 5,
        rating: 4.8,
        slots: [
          { date: '2026-05-15', times: ['10:00 AM', '11:00 AM', '02:00 PM'] },
          { date: '2026-05-16', times: ['09:00 AM', '01:00 PM'] }
        ]
      },
      {
        name: 'Dr. Alan Turing',
        category: 'Data Science',
        experience: 10,
        rating: 5.0,
        slots: [
          { date: '2026-05-16', times: ['08:00 AM', '09:00 AM'] },
          { date: '2026-05-18', times: ['03:00 PM', '04:00 PM', '05:00 PM'] }
        ]
      },
      {
        name: 'Sarah Williams',
        category: 'Design',
        experience: 7,
        rating: 4.7,
        slots: [
          { date: '2026-05-15', times: ['11:30 AM', '02:30 PM'] },
          { date: '2026-05-20', times: ['10:00 AM'] }
        ]
      },
      {
        name: 'Mike Chen',
        category: 'Marketing',
        experience: 4,
        rating: 4.5,
        slots: [
          { date: '2026-05-17', times: ['01:00 PM', '02:00 PM'] },
          { date: '2026-05-19', times: ['11:00 AM'] }
        ]
      }
    ];

    const experts = await Expert.insertMany(expertsToInsert);
    console.log(`Successfully created ${experts.length} experts across multiple categories.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
