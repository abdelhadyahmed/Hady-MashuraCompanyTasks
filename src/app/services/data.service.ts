import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export class DataService {
  constructor(private url: string, private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http
      .get(this.url)
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  getById(id: any) {
    return this.http
      .get(`${this.url}/${id}`)
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  create(resourse: any): Observable<any> {
    return this.http
      .post(this.url, resourse)
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  update(resourse: any) {
    return this.http
      .put(`${this.url}/${resourse.id}`, resourse)
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  delete(id: any) {
    return this.http
      .delete(`${this.url}/${id}`)
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  private handleError(error: Response) {
    if (error.status === 404)
      return throwError(() =>
        alert('This user not found or it would be deleted!')
      );
    if (error.status === 400) return throwError(() => alert('Bad request!'));
    return throwError(() => alert('unexpected error!'));
  }
}
