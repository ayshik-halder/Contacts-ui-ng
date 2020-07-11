import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Contact } from './contact';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  headers: HttpHeaders;

  private ayshikControllerBaseUrl = 'http://localhost:8080/demo';

  constructor(private http: HttpClient) { }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.ayshikControllerBaseUrl}/getContact/${id}`).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  getAllContact(): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${this.ayshikControllerBaseUrl}/getAllContacts`);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.ayshikControllerBaseUrl}/deleteContact/${id}`).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.ayshikControllerBaseUrl}/addContact/`, contact).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.ayshikControllerBaseUrl}/updateContact/`, contact).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  searchContact(searchKey: string): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${this.ayshikControllerBaseUrl}/search?value=${searchKey}`);
  }

  upload(file: File): Observable<Array<Contact>> {
  
    let formData = new FormData();
        formData.append("file", file);
    return this.http.post<Array<Contact>>(`${this.ayshikControllerBaseUrl}/upload`, formData).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  deleteAll() {
    return this.http.delete(`${this.ayshikControllerBaseUrl}/deleteAllTemp`).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }
}
