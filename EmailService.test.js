const { EmailService } = require('../EmailService');

(async () => {
    const service = new EmailService();
    try {
        const result = await service.sendEmail('email123', 'test@example.com', 'Hello', 'Test body');
        console.log('Test Result:', result);
    } catch (err) {
        console.error('Test Failed:', err.message);
    }

    const status = service.getStatus('email123');
    console.log('Status:', status);
})();