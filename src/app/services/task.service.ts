import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ITaskDto } from '../models/task.model'; 
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly BASE_URL = 'http://localhost:3500';

  constructor(private http: HttpClient) {}

  // Get all tasks
  getAllTasks(): Observable<ITaskDto[]> {
    return this.http
      .get<ITaskDto[]>(`${this.BASE_URL}/tasks`)
      .pipe(catchError(this.handleError));
  }

  // Add a new task
  addTask(task: ITaskDto): Observable<ITaskDto> {
    return this.http
      .post<ITaskDto>(`${this.BASE_URL}/task`, task)
      .pipe(catchError(this.handleError));
  }

  // Update an existing task
  updateTask(id: string, task: Partial<ITaskDto>): Observable<ITaskDto> {
    return this.http
      .put<ITaskDto>(`${this.BASE_URL}/task/${id}`, task)
      .pipe(catchError(this.handleError));
  }

  // Delete a task by id
  deleteTask(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/task/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred; please try again later.';

    if (error.status === 404) {
      errorMessage = 'No tasks found. Please check the database or try again later.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }

    return throwError(() => new Error(errorMessage));
  }
}
