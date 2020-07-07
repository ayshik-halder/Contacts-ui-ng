import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../contact';
import { Observable, pipe, concat } from 'rxjs';
import { ContactsService } from '../contacts.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  count: number = 0;
  file: File;
  contacts: Observable<Contact[]>;
  search: string = "";

  constructor(private router: Router, private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.contacts = this.contactsService.getAllContact();
  }

  deleteContact(id: number) {
    this.contactsService.deleteContact(id)
      .subscribe(
        data => {
          this.reloadData();
        },
        error => console.log(error));
  }

  updareContact(contact: Contact) {
    this.router.navigateByUrl('update', { state: contact });
  }

  details(contact: Contact) {
    this.router.navigateByUrl('details', { state: contact });
  }

  onSubmit() {
      if (this.search == "" || this.search == undefined) {
        this.reloadData();
      }
      else {
        this.contacts = this.contactsService.searchContact(this.search);
      }
  }

  handleFileInput() {
    // this.fileToUpload = files.item(0);
    if (this.file != undefined)
    this.contactsService.upload(this.file).subscribe(data => {
      this.reloadData();
    });
  }
  onChange(files: FileList) {
    this.file = files[0];
  }
  resetFile(){
    this.file = undefined;
  }

  deleteAll() {
    this.contactsService.deleteAll().subscribe(data=>{
      this.reloadData();
    });
  }
}
