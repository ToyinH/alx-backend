function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData);

        // Event listener for successful job creation
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        // Event listener for failed job
        job.on('failed', (err) => {
            console.log(`Notification job ${job.id} failed: ${err}`);
        });

        // Event listener for job progress
        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });

        // Save the job to the queue
        job.save((err) => {
            if (!err) {
                console.log(`Notification job created: ${job.id}`);
            }
        });
    });
}

export default createPushNotificationsJobs;
