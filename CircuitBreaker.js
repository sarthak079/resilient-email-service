class CircuitBreaker {
    constructor(threshold = 3, resetTime = 60000) {
        this.failures = {};
        this.lastFailureTime = {};
        this.threshold = threshold;
        this.resetTime = resetTime;
    }

    recordFailure(provider) {
        this.failures[provider] = (this.failures[provider] || 0) + 1;
        this.lastFailureTime[provider] = Date.now();
    }

    isOpen(provider) {
        const failureCount = this.failures[provider] || 0;
        if (failureCount >= this.threshold) {
            const timeSinceLastFail = Date.now() - this.lastFailureTime[provider];
            if (timeSinceLastFail < this.resetTime) return true;
            this.failures[provider] = 0;
        }
        return false;
    }
}

module.exports = { CircuitBreaker };