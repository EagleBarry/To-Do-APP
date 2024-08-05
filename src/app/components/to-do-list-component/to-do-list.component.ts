import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Task from '../../models/task.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss',
})
export class ToDoListComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Output() updateTaskStatusEvent = new EventEmitter<Task>();
  @Output() deleteTaskEvent = new EventEmitter<number>();
  @Output() openDialogEvent = new EventEmitter<{
    action: 'add' | 'edit';
    task?: Task;
  }>();

  displayedColumns: string[] = ['select', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  ngOnInit(): void {
    this.dataSource.data = this.tasks;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteTask(task: Task) {
    this.deleteTaskEvent.emit(task.id);
  }

  openDialog(event: { action: 'add' | 'edit'; task?: Task }) {
    this.openDialogEvent.emit(event);
  }

  updateTaskStatus(task: Task) {
    this.updateTaskStatusEvent.emit({
      ...task,
      completed: !task.completed,
    });
  }
}
