import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsService } from '../contacts.service';
import { NotificationService } from '../notification.service';
import { ContactModel } from '../ContactModel';
import { SimplifiedContact } from '../SimplifiedContact';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  showSpinner: boolean = true;
  isAllChecked: boolean = false;
  count: number = 0;
  file: File;
  contacts$: ContactModel[] = [];
  search: string = "";

  constructor(private router: Router, private contactsService: ContactsService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.isAllChecked = false;
    this.reloadData();
  }

  reloadData() {
    this.showSpinner = true;
    this.contacts$ = [];
    this.contactsService.getAllContact().subscribe(data => {
      data.forEach(d => {
        var con: ContactModel = new ContactModel();
        con.contactId = d.contactId;
        con.firstName = d.firstName;
        con.lastName = d.lastName;
        con.phoneNumber = d.phoneNumber;
        con.email = d.email;
        con.isChecked = false;
        this.contacts$.push(con);
      })
      this.showSpinner = false;
    }, error => {
      this.showSpinner = false;
    });
  }

  deleteContact(id: number) {
    this.showSpinner = true;
    this.contactsService.deleteContact(id)
      .subscribe(
        data => {
          this.notificationService.showError("Success!", "Deleted");
          this.reloadData();
        },
        ex => {
          this.notificationService.showError("Error!", ex.errorMessage);
          this.showSpinner = false;
          this.reloadData();
        });
  }

  updareContact(contact: ContactModel) {
    this.router.navigateByUrl('update', { state: contact });
  }

  details(contact: ContactModel) {
    this.router.navigateByUrl('details', { state: contact });
  }

  onSubmit() {
    this.showSpinner = true;
    this.contacts$ = [];
      if (this.search == "" || this.search == undefined) {
        this.reloadData();
      }
      else {
        this.contactsService.searchContact(this.search).subscribe( data => {
          data.forEach(d => {
            var con: ContactModel = new ContactModel();
            con.contactId = d.contactId;
            con.firstName = d.firstName;
            con.lastName = d.lastName;
            con.phoneNumber = d.phoneNumber;
            con.email = d.email;
            con.isChecked = false;
            console.log(con);
            this.contacts$.push(con);
          })
          this.showSpinner = false;
        }, error => {
          this.showSpinner = false;
        });
      }
  }

  handleFileInput() {
    // this.fileToUpload = files.item(0);
    this.showSpinner = true;
    if (this.file != undefined) {
      this.contactsService.upload(this.file).subscribe(data => {
        this.reloadData();
      }, ex => {
        this.notificationService.showError("Error!", ex.errorMessage);
        this.showSpinner = false;
      });
    } else {
      this.notificationService.showWarning("", "Please browse a file.");
      this.showSpinner = false;
    }
  }
  onChange(files: FileList) {
    this.file = files[0];
  }
  resetFile(){
    this.file = undefined;
  }

  deleteAll() {
    this.showSpinner = true;
        if (confirm('Are you sure you want to delete all the contacts from database?')) {
          this.contactsService.deleteAll().subscribe(data=>{
            this.notificationService.showWarning("Success!", "Deleted");
            this.isAllChecked = false;
            this.reloadData();
          }, ex => {
            this.notificationService.showError("Error!", ex.errorMessage);
            this.showSpinner = false;
          });
        } else 
        this.showSpinner = false;
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    row += 'Given Name,Family Name,E-mail 1 - Value,Phone 1 - Type,Phone 1 - Value,Phone 2 - Type,Phone 2 - Value,';
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i + 1) + '';
        for (let index in headerList) {
            let head = headerList[index];
            line += array[i][head] ? ',' + array[i][head] : ',';
        }
        str += line + '\r\n';
    }
    return str;
  }


  downloadFile(filename: string = 'data') {
    filename = new Date().toLocaleString();
    let toExportFile: Array<SimplifiedContact> = [];
    this.contacts$.forEach(con => {
      if(con.isChecked) {

        let simplifiedContact: SimplifiedContact = new SimplifiedContact();
        simplifiedContact.firstName = con.firstName;
        simplifiedContact.lastName = con.lastName;
        simplifiedContact.email = con.email;

        con.phoneNumber.forEach(numberElement => {

          if(numberElement.phoneNumberType == 'Mobile') {
            simplifiedContact.mobileNumberType = 'Mobile';
            simplifiedContact.mobileNumber += numberElement.phoneNumber ? ':::' + numberElement.phoneNumber : '';
          }

          if(numberElement.phoneNumberType == 'Work') {
            console.log(numberElement.phoneNumberType);
            simplifiedContact.workNumberType = 'Work';
            simplifiedContact.workNumber += numberElement.phoneNumber ? ':::' + numberElement.phoneNumber : '';
          }
        })

        simplifiedContact.mobileNumber = simplifiedContact.mobileNumber ? simplifiedContact.mobileNumber.substring(3) : simplifiedContact.mobileNumber;
        simplifiedContact.workNumber = simplifiedContact.workNumber ? simplifiedContact.workNumber.substring(3) : simplifiedContact.workNumber;
        toExportFile.push(simplifiedContact);
      }
    });
    if (toExportFile.length > 0) {
      let csvData = this.ConvertToCSV(toExportFile, [
        'firstName', 'lastName', 'email', 'mobileNumberType', 'mobileNumber', 'workNumberType', 'workNumber']);
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

  addOrRemove(contact: ContactModel) {
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
