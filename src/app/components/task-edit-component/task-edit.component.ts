import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Task, { TaskToAdd } from '../../models/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit {
  title: string = this.data.action === 'edit' ? 'Edit Task' : 'Add Task';
  form!: FormGroup;

  constructor(
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskEditComponent>,
    public fb: FormBuilder,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    if (this.data.action === 'edit') {
      this.form = this.fb.group({
        name: [this.data.task.name, Validators.required],
        description: [this.data.task.description, Validators.required],
        completed: [this.data.task.completed],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        completed: [false],
      });
    }
  }

  addTask(): void {
    if (this.form.invalid) {
      return;
    }
    const taskToAdd: TaskToAdd = {
      name: this.form.value.name,
      description: this.form.value.description,
      completed: this.form.value.completed,
    };

    if (this.data.action === 'add') {
      this.taskService.addTask(taskToAdd).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      const taskToUpdate: Task = { id: this.data.task.id, ...taskToAdd };
      this.taskService.updateTask(taskToUpdate).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
