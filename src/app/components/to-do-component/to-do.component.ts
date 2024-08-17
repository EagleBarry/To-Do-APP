import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { ITaskDto } from '../../models/task.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss'],
})
export class ToDoComponent implements OnInit {
  tasks$: Observable<ITaskDto[]> = of([]);
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks$ = this.taskService.getAllTasks().pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.refreshTasks(), // Call refreshTasks after deleting a task
      error: this.handleError.bind(this),
    });
  }

  refreshTasks(): void {
    this.loadTasks(); // Reuse loadTasks method to refresh the list
  }

  private handleError(error: HttpErrorResponse): Observable<ITaskDto[]> {
    this.errorMessage = error.message || 'An error occurred';
    return of([]);
  }
}
