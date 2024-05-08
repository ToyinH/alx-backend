import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Define a function to send notifications
function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: This is the code to verify your account`);
}

// Process jobs in the queue for 'push_notification_code'
queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done(); // Call done to indicate that the job processing is complete
});

// Handle uncaught exceptions
queue.on('error', (err) => {
    console.error('Queue error:', err);
});
