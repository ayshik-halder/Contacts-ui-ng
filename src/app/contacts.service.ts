import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from './contact';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  headers: HttpHeaders;

  private ayshikControllerBaseUrl = 'http://localhost:8080/demo';

  constructor(private http: HttpClient) { }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.ayshikControllerBaseUrl}/getContact/${id}`);
  }

  getAllContact(): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${this.ayshikControllerBaseUrl}/getAllContacts`);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.ayshikControllerBaseUrl}/deleteContact/${id}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.ayshikControllerBaseUrl}/addContact/`, contact);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.ayshikControllerBaseUrl}/updateContact/`, contact);
  }

  searchContact(searchKey: string): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${this.ayshikControllerBaseUrl}/search?value=${searchKey}`);
  }

  upload(file: File): Observable<Array<Contact>> {
  
    let formData = new FormData();
        formData.append("file", file);
    return this.http.post<Array<Contact>>(`${this.ayshikControllerBaseUrl}/upload`, formData);
  }

  deleteAll() {
    return this.http.delete(`${this.ayshikControllerBaseUrl}/deleteAllTemp`);
  }
}
