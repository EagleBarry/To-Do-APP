import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITaskDto } from '../../models/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit {
  title!: string;
  form!: FormGroup;

  constructor(
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskEditComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { action: 'add' | 'edit'; task?: ITaskDto }
  ) {}

  ngOnInit(): void {
    this.title = this.data.action === 'edit' ? 'Edit Task' : 'Add Task';
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: [this.data.task?.name || '', Validators.required],
      description: [this.data.task?.description || '', Validators.required],
      completed: [this.data.task?.completed || false],
    });
  }

  addTask(): void {
    if (this.form.invalid) return;

    const taskToSave: Partial<ITaskDto> = this.form.value;

    if (this.data.action === 'add') {
      this.taskService.addTask(taskToSave as ITaskDto).subscribe(() => {
        this.dialogRef.close({ success: true, action: 'add' });
      });
    } else if (this.data.action === 'edit' && this.data.task) {
      const taskToUpdate: ITaskDto = { ...this.data.task, ...taskToSave } as ITaskDto;
      this.taskService.updateTask(taskToUpdate._id as string, taskToUpdate).subscribe(() => {
        this.dialogRef.close({ success: true, action: 'edit' });
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
