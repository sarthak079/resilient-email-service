class MockProviderB {
    constructor() {
        this.name = 'MockProviderB';
    }

    async send(to, subject, body) {
        if (Math.random() < 0.5) throw new Error('Simulated failure B');
        return `Sent by B to ${to}`;
    }
}

module.exports = { MockProviderB };