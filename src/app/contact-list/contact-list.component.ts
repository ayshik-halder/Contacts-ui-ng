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
    if (confirm('Are you sure you want to delete all the contacts from database?'))
    this.contactsService.deleteAll().subscribe(data=>{
      this.reloadData();
    });
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    row += 'Given Name,Family Name,E-mail 1 - Value,Phone 1 - Value,';
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i + 1) + '';
        for (let index in headerList) {
            let head = headerList[index];
            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
  }

  downloadFile(filename: string = 'data') {
    this.contacts.subscribe(data => {
      let csvData = this.ConvertToCSV(data, [
        'firstName', 'lastName', 'email', 'phoneNumber']);
      console.log(csvData)
      let blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8;'
    });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      navigator.userAgent.indexOf('Chrome') == -1;
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", filename + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      }
    );
  }
}
