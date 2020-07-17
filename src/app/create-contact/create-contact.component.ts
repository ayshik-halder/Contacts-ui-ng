import { Component, OnInit } from '@angular/core';
import { ContactModel } from '../ContactModel';
import { ContactsService } from '../contacts.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { PhoneNumberModel } from '../PhoneNumberModel';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {

  private MOBILE: string = "Mobile";
  private WORK: string = "Work";

  contact: ContactModel = new ContactModel();
  mobileNumber1: string = "";
  mobileNumber2: string = "";
  workNumber1: string = "";
  workNumber2: string = "";
  phoneNumberList: Array<PhoneNumberModel> = [];
  constructor(private contactsService: ContactsService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
  }

  save() {
    this.phoneNumberList = [];
    if(this.mobileNumber1 != "" && this.mobileNumber1 != null) {
      this.phoneNumberList.push(new PhoneNumberModel(this.mobileNumber1, this.MOBILE));
    }
    if(this.mobileNumber2 != "" && this.mobileNumber2 != null) {
      this.phoneNumberList.push(new PhoneNumberModel(this.mobileNumber2, this.MOBILE));
    }
    if(this.workNumber1 != "" && this.workNumber1 != null) {
      this.phoneNumberList.push(new PhoneNumberModel(this.workNumber1, this.WORK));
    }
    if(this.workNumber2 != "" && this.workNumber2 != null) {
      this.phoneNumberList.push(new PhoneNumberModel(this.workNumber2, this.WORK));
    }
    this.contact.phoneNumber = this.phoneNumberList;
    console.log(this.contact)
    this.contactsService.createContact(this.contact)
      .subscribe(
      data => {
        console.log(data);
        this.notificationService.showSuccess("Success!", "Created!!");
        this.router.navigateByUrl('details', { state: data });
      }, 
      exception => {
        console.log(exception);
        this.notificationService.showError("Error!", exception.errorMessage);
      });
  }

  onSubmit() {
    this.save();
  }
}
