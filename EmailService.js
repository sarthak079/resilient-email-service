const { MockProviderA } = require('./providers/MockProviderA');
const { MockProviderB } = require('./providers/MockProviderB');
const { RateLimiter } = require('./utils/RateLimiter');
const { CircuitBreaker } = require('./utils/CircuitBreaker');
const { log } = require('./logs/logger');

class EmailService {
    constructor() {
        this.providers = [new MockProviderA(), new MockProviderB()];
        this.rateLimiter = new RateLimiter(5, 60000);
        this.sentEmails = new Set();
        this.status = {};
        this.cb = new CircuitBreaker();
    }

    async sendEmail(emailId, to, subject, body) {
        if (this.sentEmails.has(emailId)) {
            log(`Email ${emailId} already sent. Skipping.`);
            return this.status[emailId];
        }

        if (!this.rateLimiter.allow()) {
            throw new Error('Rate limit exceeded.');
        }

        for (let i = 0; i < this.providers.length; i++) {
            const provider = this.providers[i];

            if (this.cb.isOpen(provider.name)) {
                log(`Circuit open for ${provider.name}, skipping.`);
                continue;
            }

            try {
                const result = await this.retrySend(provider, to, subject, body, 3);
                this.sentEmails.add(emailId);
                this.status[emailId] = { success: true, provider: provider.name };
                log(`Email ${emailId} sent successfully via ${provider.name}`);
                return this.status[emailId];
            } catch (err) {
                this.cb.recordFailure(provider.name);
                log(`Failure using ${provider.name}: ${err.message}`);
            }
        }

        this.status[emailId] = { success: false };
        throw new Error('All providers failed to send email.');
    }

    async retrySend(provider, to, subject, body, retries, delay = 500) {
        for (let i = 0; i <= retries; i++) {
            try {
                return await provider.send(to, subject, body);
            } catch (err) {
                if (i === retries) throw err;
                await new Promise(res => setTimeout(res, delay * 2 ** i));
            }
        }
    }

    getStatus(emailId) {
        return this.status[emailId] || { status: 'unknown' };
    }
}

module.exports = { EmailService };