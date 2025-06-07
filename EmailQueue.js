class EmailQueue {
    constructor(emailService) {
        this.queue = [];
        this.emailService = emailService;
    }

    add(emailId, to, subject, body) {
        this.queue.push({ emailId, to, subject, body });
        this.process();
    }

    async process() {
        if (this.processing) return;
        this.processing = true;
        while (this.queue.length) {
            const { emailId, to, subject, body } = this.queue.shift();
            try {
                await this.emailService.sendEmail(emailId, to, subject, body);
            } catch (err) {
                console.error('Failed to send from queue:', err.message);
            }
        }
        this.processing = false;
    }
}

module.exports = { EmailQueue };