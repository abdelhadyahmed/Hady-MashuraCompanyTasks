import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class DataService {
  constructor(private url: string, private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.url);
  }

  getById(id: any) {
    return this.http.get(`${this.url}/${id}`);
  }

  create(resourse: any): Observable<any> {
    return this.http.post(this.url, resourse);
  }

  update(resourse: any) {
    return this.http.put(`${this.url}/${resourse.id}`, resourse);
  }

  delete(id: any) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
