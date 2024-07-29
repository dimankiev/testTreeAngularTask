import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = '/api/categories'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/GetAll`);
  }

  getStatic(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('/flattened_categories.json');
  }
}
