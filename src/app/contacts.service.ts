import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ContactModel } from './ContactModel';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  headers: HttpHeaders;

  private ayshikControllerBaseUrl = 'http://localhost:8080/demo';

  constructor(private http: HttpClient) { }

  getContact(id: number): Observable<ContactModel> {
    return this.http.get<ContactModel>(`${this.ayshikControllerBaseUrl}/getContact/${id}`).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  getAllContact(): Observable<Array<ContactModel>> {
    return this.http.get<Array<ContactModel>>(`${this.ayshikControllerBaseUrl}/getAllContacts`);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.ayshikControllerBaseUrl}/deleteContact/${id}`).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  createContact(contact: ContactModel): Observable<ContactModel> {
    return this.http.post<ContactModel>(`${this.ayshikControllerBaseUrl}/addContact/`, contact).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));
  }

  updateContact(contact: ContactModel): Observable<ContactModel> {
    return this.http.put<ContactModel>(`${this.ayshikControllerBaseUrl}/updateContact/`, contact).pipe(
      catchError((err) => {
        return throwError(err.error);
      }));;
  }

  searchContact(searchKey: string): Observable<Array<ContactModel>> {
    return this.http.get<Array<ContactModel>>(`${this.ayshikControllerBaseUrl}/search?value=${searchKey}`);
  }

  upload(file: File): Observable<Array<ContactModel>> {
  
    let formData = new FormData();
        formData.append("file", file);
    return this.http.post<Array<ContactModel>>(`${this.ayshikControllerBaseUrl}/upload`, formData).pipe(
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
