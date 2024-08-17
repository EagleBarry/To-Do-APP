import { Document, Schema, model } from 'mongoose';

// Define a TypeScript interface for the Task document
export interface ITask extends Document {
  name: string;
  description: string;
  completed: boolean;
}

// Create the Task schema
const TaskSchema: Schema<ITask> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Create the Task model from the schema and export it
const Task = model<ITask>('Task', TaskSchema);
export default Task;

export interface ITaskDto {
  _id?: string;
  name: string;
  description: string;
  completed: boolean;
}
