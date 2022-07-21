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

  create(response: any): Observable<any> {
    return this.http.post(this.url, response);
  }

  update(response: any) {
    return this.http.put(this.url, response);
  }

  delete(id: any) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
