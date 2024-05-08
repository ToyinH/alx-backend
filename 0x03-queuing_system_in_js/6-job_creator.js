import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Define the Job data
const jobData = {
    phoneNumber: '1234567890',
    message: 'Hello, world!'
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData);

// Event listener for successful job creation
job.on('complete', () => {
    console.log('Notification job completed');
});

// Event listener for failed job
job.on('failed', () => {
    console.log('Notification job failed');
});

// Save the job to the queue
job.save((err) => {
    if (!err) {
        console.log(`Notification job created: ${job.id}`);
    }
});

// Handle uncaught exceptions
queue.on('error', (err) => {
    console.error('Queue error:', err);
});
