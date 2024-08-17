import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ITaskDto } from '../../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit-component/task-edit.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
})
export class ToDoListComponent implements OnChanges {
  @Input() tasks: ITaskDto[] = [];
  @Output() deleteTaskEvent = new EventEmitter<string>();
  @Output() refreshTasksEvent = new EventEmitter<void>();

  displayedColumns: string[] = ['select', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<ITaskDto>([]);
  errorMessage: string | null = null;

  newTaskName: string = '';
  newTaskDescription: string = '';

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnChanges(): void {
    this.dataSource.data = this.tasks;
  }

  deleteTask(task: ITaskDto): void {
    console.log('Deleting task:', task);
    this.deleteTaskEvent.emit(task._id as string);
    this.refreshTasksEvent.emit();
  }

  addTask(): void {
    console.log('Adding task:', this.newTaskName, this.newTaskDescription);
    const newTask: ITaskDto = {
      name: this.newTaskName,
      description: this.newTaskDescription,
      completed: false,
    };

    this.taskService.addTask(newTask).subscribe({
      next: () => {
        console.log('Task added successfully');
        this.refreshTasksEvent.emit();
      },
      error: (error) => {
        console.error('Error adding task:', error.message);
        this.errorMessage = error.message;
      },
    });
  }

  updateTaskStatus(task: ITaskDto): void {
    console.log('Updating task status:', task);
    this.taskService.updateTask(task._id as string, { completed: !task.completed }).subscribe({
      next: () => {
        console.log('Task status updated successfully');
        this.refreshTasksEvent.emit();
      },
      error: (error) => {
        console.error('Error updating task status:', error.message);
        this.errorMessage = error.message;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(data: { action: string; task?: ITaskDto }): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '250px',
      data,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if (result && result.success) {
        this.refreshTasksEvent.emit();
      }
    });
  }
}
