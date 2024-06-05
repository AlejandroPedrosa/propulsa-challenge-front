import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { FormGroup, FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  completed_at: string;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  sortDirection: { [key: string]: boolean } = {
    title: true,
    status: true,
    created_at: true,
    completed_at: true,
  };
  currentTask: Task | null = null;
  isModalEditOpen = false;
  isModalDeleteOpen = false;

  constructor(private taskService: TaskService) {}

  loadTask() {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }
  ngOnInit(): void {
    this.loadTask();
    this.taskService.taskAdded$.subscribe((added) => {
      if (added) {
        this.loadTask();
      }
    });
  }

  toggleTask(task: Task): void {
    this.taskService
      .updateTask(task.id, !task.completed)
      .subscribe((updatedTask) => {
        task.completed = updatedTask.completed;
        task.completed_at = updatedTask.completed_at;
      });
  }
  sortTasksBy(key: string): void {
    this.sortDirection[key] = !this.sortDirection[key];
    if (key === 'title') {
      this.tasks.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return this.sortDirection[key] ? comparison : -comparison;
      });
    } else if (key === 'status') {
      this.tasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return this.sortDirection[key]
          ? a.completed
            ? -1
            : 1
          : a.completed
          ? 1
          : -1;
      });
    } else if (key === 'created_at') {
      this.tasks.sort((a, b) => {
        const dateA = a[key] ? new Date(a[key]) : new Date(0);
        const dateB = b[key] ? new Date(b[key]) : new Date(0);
        const comparison = dateA.getTime() - dateB.getTime();
        return this.sortDirection[key] ? comparison : -comparison;
      });
    } else if (key === 'completed_at') {
      this.tasks.sort((a, b) => {
        const dateA = a[key] ? new Date(a[key]) : new Date(0);
        const dateB = b[key] ? new Date(b[key]) : new Date(0);
        const comparison = dateA.getTime() - dateB.getTime();
        return this.sortDirection[key] ? comparison : -comparison;
      });
    }
  }

  editTask(task: Task): void {
    this.currentTask = task;
    this.isModalEditOpen = true;
  }

  saveTaskEdited(form: NgForm): void {
    if (this.currentTask && form.value.title.length !== 0) {
      this.taskService
        .updateTask(
          this.currentTask.id,
          this.currentTask.completed,
          form.value.title
        )
        .subscribe(() => {
          this.currentTask = null;
          this.isModalEditOpen = false;
          this.loadTask();
        });
    }
  }
  closeModal() {
    this.isModalDeleteOpen = false;
    this.isModalEditOpen = false;
    this.currentTask = null;
  }

  deleteTaskModal(task: Task): void {
    this.currentTask = task;
    this.isModalDeleteOpen = true;
  }
  deleteTask(id?: number): void {
    this.taskService.deleteTask(id!).subscribe(() => {
      this.tasks = this.tasks.filter((task: Task) => task.id !== id);
      this.closeModal();
    });
  }
}
