import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import Task from '../../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit-component/task-edit.component';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.scss',
})
export class ToDoComponent {
  tasks$!: Observable<Task[]>;

  constructor(private taskService: TaskService, private dialog: MatDialog) {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.taskService.getAllTasks();
  }

  deleteTask(id: number) {
    console.log('deleteTask', id);
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  openDialog(event: { action: 'add' | 'edit'; task?: Task }) {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      data: { action: event.action, task: event.task },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  updateTaskStatus(task: Task) {
    this.taskService.updateTaskStatus(task).subscribe(() => {
      this.loadTasks();
    });
  }
}
