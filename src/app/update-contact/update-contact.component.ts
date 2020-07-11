import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.css']
})
export class UpdateContactComponent implements OnInit {

  state$: Observable<Contact>;
  contact: Contact = new Contact();
  constructor(private activatedRoute: ActivatedRoute, private contactsService: ContactsService, private router: Router, private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe(data => {
      if (data.id) {
        this.contact = data;
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  update() {
    console.log(this.contact)
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

  onSubmit() {
    this.update();
  }
}
