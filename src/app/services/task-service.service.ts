import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';
environment.apiUrl;

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  completed_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private taskAddedSource = new BehaviorSubject<boolean>(false);
  taskAdded$ = this.taskAddedSource.asObservable();

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTaskService(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title }).pipe(
      tap(() => {
        this.taskAddedSource.next(true);
      })
    );
  }

  updateTask(id: number, completed: boolean, title?: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { completed, title });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
