import { Component, OnInit } from '@angular/core';
import { ContactModel } from '../ContactModel';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { PhoneNumberModel } from '../PhoneNumberModel';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.css']
})
export class UpdateContactComponent implements OnInit {

  private MOBILE: string = "Mobile";
  private WORK: string = "Work";

  mobileNumber1: string = "";
  mobileNumber2: string = "";
  workNumber1: string = "";
  workNumber2: string = "";
  state$: Observable<ContactModel>;
  contact: ContactModel = new ContactModel();
  constructor(private activatedRoute: ActivatedRoute, private contactsService: ContactsService, private router: Router, private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe(data => {
      if (data.contactId) {
        this.contact = data;
        this.initialDetailsUpdate();
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  initialDetailsUpdate() {
    let mobiles: Array<string> = [];
    let works: Array<string> = [];
    this.contact.phoneNumber.forEach(element => {
      if (element.phoneNumberType == 'Mobile') mobiles.push(element.phoneNumber)
      if (element.phoneNumberType == 'Work') works.push(element.phoneNumber)
    });
    if (mobiles.length > 0) this.mobileNumber1 = mobiles[0];
    if (mobiles.length > 1) this.mobileNumber2 = mobiles[1];
    if (works.length > 0) this.workNumber1 = works[0];
    if (works.length > 1) this.workNumber2 = works[1];
  }

  update() {
    this.phnToUpdate();
    this.contactsService.updateContact(this.contact)
      .subscribe(data => {
        this.notificationService.showSuccess("Success!", "Created!!");
        console.log(data);
        this.contact = data;
        this.router.navigateByUrl('details', { state: data });
      }, error => {
        this.notificationService.showError("Error!", error.errorMessage);
        console.log(error);
      });
  }

  phnToUpdate() {
      let phones : Array<PhoneNumberModel> = [];
      if (this.mobileNumber1) phones.push(new PhoneNumberModel(this.mobileNumber1, 'Mobile'));
      if (this.mobileNumber2) phones.push(new PhoneNumberModel(this.mobileNumber2, 'Mobile'));
      if (this.workNumber1) phones.push(new PhoneNumberModel(this.workNumber1, 'Work'));
      if (this.workNumber2) phones.push(new PhoneNumberModel(this.workNumber2, 'Work'));
      this.contact.phoneNumber = phones;
  }

  onSubmit() {
    this.update();
  }
}
