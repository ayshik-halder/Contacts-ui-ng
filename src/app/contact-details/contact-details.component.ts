import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../contact';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  state$: Observable<Contact>;
  contact: Contact = new Contact();
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

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

  updareContact(contact: Contact) {
    this.router.navigateByUrl('update', { state: contact });
  }
 
}
