class MockProviderA {
    constructor() {
        this.name = 'MockProviderA';
    }

    async send(to, subject, body) {
        if (Math.random() < 0.3) throw new Error('Simulated failure A');
        return `Sent by A to ${to}`;
    }
}

module.exports = { MockProviderA };