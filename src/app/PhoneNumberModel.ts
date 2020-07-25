export class PhoneNumberModel {
    phoneNumberId: number;
    phoneNumber: string;
    phoneNumberType: string;

    constructor(number: string, type: string) {
        this.phoneNumber = number;
        this.phoneNumberType = type;
    }
}