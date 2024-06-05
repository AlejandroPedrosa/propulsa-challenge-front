// import { Component } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
// import { CommonModule } from '@angular/common';
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-task-form',
//   templateUrl: './task-form.component.html',
//   styleUrls: ['./task-form.component.css'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class TaskFormComponent {
//   title: string = '';
//   constructor(private taskService: TaskService) {}

//   addTask(form: NgForm): void {
//     console.log(
//       '🚀 ~ TaskFormComponent ~ this.taskService.addTaskService ~ task:',
//       this.title,
//       form.value
//     );
//     // if (this.title.trim()) {
//     //   this.taskService.addTaskService(this.title).subscribe((task) => {
//     //     this.title = '';
//     //     // Notify parent component about the new task
//     //     this.taskService.getTasks();
//     //   });
//     // }
//   }
// }

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TaskFormComponent {
  constructor(private taskService: TaskService) {}

  onSubmit(form: NgForm) {
    this.taskService.addTaskService(form.value['title']).subscribe(() => {
      form.setValue({ title: '' });
    });
  }
}
