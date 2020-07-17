import { PhoneNumberModel } from './PhoneNumberModel';

export class ContactModel {
    contactId: number;
    firstName: string;
    lastName: string;
    phoneNumber: Array<PhoneNumberModel> = [];
    email: string;
    isChecked: boolean;
}