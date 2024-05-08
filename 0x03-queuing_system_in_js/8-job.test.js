import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
    let queue;

    beforeEach(() => {
        // Create a Kue queue in test mode
        queue = kue.createQueue();
        queue.testMode.enter();
    });

    afterEach(() => {
        // Clear the queue and exit test mode after each test
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
    });

    it('should create jobs in the queue', () => {
        const list = [
            {
                phoneNumber: '4153518780',
                message: 'This is the code 1234 to verify your account'
            },
            {
                phoneNumber: '4153518781',
                message: 'This is the code 4562 to verify your account'
            }
        ];
        createPushNotificationsJobs(list, queue);

        // Check if jobs are added to the queue
        expect(queue.testMode.jobs.length).to.equal(2);

        // Check job properties
        const job1 = queue.testMode.jobs[0];
        expect(job1.type).to.equal('push_notification_code_3');
        expect(job1.data).to.deep.equal(list[0]);

        const job2 = queue.testMode.jobs[1];
        expect(job2.type).to.equal('push_notification_code_3');
        expect(job2.data).to.deep.equal(list[1]);
    });
});
