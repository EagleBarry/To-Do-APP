import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Task, { TaskToAdd } from '../models/task.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private URL = 'http://localhost:3500';
  private httpOptions = {
    responseType: 'text' as 'json',
  };

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.URL}/tasks`)
      .pipe(catchError(this.handleError));
  }

  addTask(task: TaskToAdd): Observable<void> {
    return this.http
      .post<void>(`${this.URL}/task`, task, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateTaskStatus(task: Task): Observable<void> {
    return this.http
      .put<void>(`${this.URL}/task/${task.id}`, { ...task }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateTask(task: Task): Observable<void> {
    return this.http
      .put<void>(`${this.URL}/task/${task.id}`, { ...task }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.URL}/task/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Unexpected error; please try again later.')
    );
  }
}
