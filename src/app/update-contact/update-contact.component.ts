import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.css']
})
export class UpdateContactComponent implements OnInit {

  state$: Observable<Contact>;
  contact: Contact = new Contact();
  submitted = false;
  constructor(private activatedRoute: ActivatedRoute, private contactsService: ContactsService) { }


  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe(data => {
      this.contact = data;
      console.log(data);
    });
  }

  update() {
    console.log(this.contact)
    this.contactsService.updateContact(this.contact)
      .subscribe(data => {
        console.log(data);
        this.contact = data;
      }, error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    this.update();
  }
}
