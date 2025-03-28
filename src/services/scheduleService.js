const cron = require('cron');
const passcodeService = require('./passcodeService');
const telegramService = require('./telegramService');

class ScheduleService {
    constructor() {
        this.scheduleState = {
            type: 'infinite',
            enabled: true
        };

        // Initialize cron jobs
        this.dailyJob = new cron.CronJob('0 0 * * *', () => {
            if (this.scheduleState.enabled && this.scheduleState.type === 'daily') {
                const newPasscode = passcodeService.generatePasscode();
                telegramService.sendPasscodeToTelegram(newPasscode, '🔄 Daily Passcode Update!');
            }
        });

        this.weeklyJob = new cron.CronJob('0 0 * * 0', () => {
            if (this.scheduleState.enabled && this.scheduleState.type === 'weekly') {
                const newPasscode = passcodeService.generatePasscode();
                telegramService.sendPasscodeToTelegram(newPasscode, '📅 Weekly Passcode Update!');
            }
        });

        this.monthlyJob = new cron.CronJob('0 0 1 * *', () => {
            if (this.scheduleState.enabled && this.scheduleState.type === 'monthly') {
                const newPasscode = passcodeService.generatePasscode();
                telegramService.sendPasscodeToTelegram(newPasscode, '📆 Monthly Passcode Update!');
            }
        });
    }

    async setSchedule(scheduleType) {
        // Stop all existing jobs
        this.dailyJob.stop();
        this.weeklyJob.stop();
        this.monthlyJob.stop();

        // Update schedule state
        this.scheduleState.type = scheduleType;
        this.scheduleState.enabled = scheduleType !== 'infinite';

        // Start appropriate job
        if (this.scheduleState.enabled) {
            switch (scheduleType) {
                case 'daily':
                    this.dailyJob.start();
                    break;
                case 'weekly':
                    this.weeklyJob.start();
                    break;
                case 'monthly':
                    this.monthlyJob.start();
                    break;
            }
        }
    }

    async getStatus() {
        let nextRun = 'Not scheduled';
        
        if (this.scheduleState.enabled) {
            switch (this.scheduleState.type) {
                case 'daily':
                    nextRun = this.dailyJob.nextDate().toLocaleString();
                    break;
                case 'weekly':
                    nextRun = this.weeklyJob.nextDate().toLocaleString();
                    break;
                case 'monthly':
                    nextRun = this.monthlyJob.nextDate().toLocaleString();
                    break;
            }
        }

        return `📅 Schedule Status:\n\n` +
            `Type: ${this.scheduleState.type.toUpperCase()}\n` +
            `Status: ${this.scheduleState.enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
            `Next Run: ${nextRun}`;
    }
}

module.exports = new ScheduleService(); 