import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactModel } from '../ContactModel';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  state$: Observable<ContactModel>;
  contact: ContactModel = new ContactModel();
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe(data => {
      if (data.contactId) {
        this.contact = data;
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

  updareContact(contact: ContactModel) {
    this.router.navigateByUrl('update', { state: contact });
  }
 
}
