import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactsService } from '../contacts.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {

  contact: Contact = new Contact();
  constructor(private contactsService: ContactsService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
  }

  newContact(): void {
    this.contact = new Contact();
  }

  save() {
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
