const { v4: uuidv4 } = require('uuid');

class PasscodeService {
    constructor() {
        this.currentPasscode = null;
        this.lastGeneratedAt = null;
        this.generatePasscode = this.generatePasscode.bind(this);
        this.getCurrentPasscode = this.getCurrentPasscode.bind(this);
        this.getLastGeneratedAt = this.getLastGeneratedAt.bind(this);
    }

    generatePasscode() {
        this.currentPasscode = uuidv4();
        this.lastGeneratedAt = new Date();
        return this.currentPasscode;
    }

    getCurrentPasscode() {
        return this.currentPasscode;
    }

    getLastGeneratedAt() {
        return this.lastGeneratedAt;
    }
}

const passcodeService = new PasscodeService();
module.exports = passcodeService; 