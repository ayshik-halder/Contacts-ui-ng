import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../contact';
import { Observable, pipe, concat } from 'rxjs';
import { ContactsService } from '../contacts.service';
import { async } from '@angular/core/testing';
import { findIndex } from 'rxjs/operators';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  isAllChecked: boolean = false;
  count: number = 0;
  file: File;
  contacts$: Contact[] = [];
  search: string = "";

  constructor(private router: Router, private contactsService: ContactsService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.isAllChecked = false;
    this.reloadData();
  }

  reloadData() {
    this.contacts$ = [];
    this.contactsService.getAllContact().subscribe(data => {
      data.forEach(d => {
        var con: Contact = new Contact();
        con.id = d.id;
        con.firstName = d.firstName;
        con.lastName = d.lastName;
        con.phoneNumber = d.phoneNumber;
        con.email = d.email;
        con.isChecked = false;
        this.contacts$.push(con);
      })
    });
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
    this.contacts$ = [];
      if (this.search == "" || this.search == undefined) {
        this.reloadData();
      }
      else {
        this.contactsService.searchContact(this.search).subscribe( data => {
          data.forEach(d => {
            var con: Contact = new Contact();
            con.id = d.id;
            con.firstName = d.firstName;
            con.lastName = d.lastName;
            con.phoneNumber = d.phoneNumber;
            con.email = d.email;
            con.isChecked = false;
            console.log(con);
            this.contacts$.push(con);
          })
        });
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
      if (this.isAllChecked) {
        if (confirm('Are you sure you want to delete all the contacts from database?'))
      this.contactsService.deleteAll().subscribe(data=>{
        this.isAllChecked = false;
        this.reloadData();
      });
      } else {
        let ids: Array<number> = [];
        this.contacts$.forEach(con => {
          if(con.isChecked)
            ids.push(con.id);
        });
        console.log(ids);
        if (ids.length == 0) {
          this.notificationService.showWarning("", "Please select at least one row to delete.");
        } else {
          if (confirm('Are you sure you want to delete all the contacts from database?'))
          this.contactsService.deleteMultiple(ids).subscribe(data => {
            this.notificationService.showSuccess("Success!", "Deleted!!");
            this.reloadData();
          }, ex => {
            this.notificationService.showError("Error!", ex.errorMessage);
            this.reloadData();
          });
        }
      }
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

    let toExportFile: Array<Contact> = [];
    this.contacts$.forEach(con => {
      if(con.isChecked)
        toExportFile.push(con);
    });
    if (toExportFile.length > 0) {
      let csvData = this.ConvertToCSV(toExportFile, [
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
      this.notificationService.showSuccess("Success!", "Downloaded!!");
    } else {
      this.notificationService.showWarning("", "Please select at least one row to delete.");
    }
  }

  checkedAll() {
        for(var con in this.contacts$) {
          this.contacts$[con].isChecked = this.isAllChecked;
        }
  }

  addOrRemove(contact: Contact) {
    console.log(contact);
    if(!contact.isChecked) this.isAllChecked = false;
    var allTrue = true;
    this.contacts$.forEach(data => {
      if(!data.isChecked) {
        allTrue = false;
      }
    })
    if(allTrue) this.isAllChecked = true;
  }

  arrayRemove(arr, value) { 
    return arr.filter(ele => { ele != value });
  }
}
