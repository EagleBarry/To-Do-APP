import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskEditComponent } from './components/task-edit-component/task-edit.component';
import { AppComponent } from './app.component';
import { ToDoListComponent } from './components/to-do-list-component/to-do-list.component';

const routes: Routes = [
  {
    component: ToDoListComponent,
    path: 'tasks',
    title: 'Task list',
  },
  {
    component: TaskEditComponent,
    path: 'add',
    title: 'Add task',
  },
  { path: '**', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
