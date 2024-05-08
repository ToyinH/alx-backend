import kue from 'kue';

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notifications
function sendNotification(phoneNumber, message, job, done) {
    // Track progress of the job
    job.progress(0, 100);

    if (blacklistedNumbers.includes(phoneNumber)) {
        // Fail the job if the phone number is blacklisted
        const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
        done(new Error(errorMessage));
    } else {
        // Track progress to 50%
        job.progress(50, 100);

        // Log the notification message
        console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

        // Simulate sending the notification
        setTimeout(() => {
            // Track progress to 100% and complete the job
            job.progress(100, 100);
            done();
        }, 1000);
    }
}

// Create a Kue queue
const queue = kue.createQueue({
    concurrency: 2 // Process two jobs at a time
});

// Process jobs in the queue 'push_notification_code_2'
queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});

// Handle uncaught exceptions
queue.on('error', (err) => {
    console.error('Queue error:', err);
});
