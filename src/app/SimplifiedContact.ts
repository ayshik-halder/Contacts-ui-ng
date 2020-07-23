
export class SimplifiedContact {

    contactId: number;
    firstName: string;
    lastName: string;
    email: string;
    isChecked: boolean;
    mobileNumberType: string;
    mobileNumber: string;
    workNumberType: string;
    workNumber: string;
    constructor() {
        this.contactId = 0;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.mobileNumber = '';
        this.mobileNumberType = '';
        this.workNumber = '';
        this.workNumberType = '';
    }
}