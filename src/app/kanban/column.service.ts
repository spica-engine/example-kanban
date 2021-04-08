import { Injectable } from "@angular/core";
import { Column, Task } from "./column.model";
import * as Bucket from "@spica-devkit/bucket";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";
import { tap } from "rxjs/internal/operators/tap";

@Injectable({
  providedIn: "root"
})
export class ColumnService {
  columnsBucketId = environment.columnsBucketId;
  usersBucketId = environment.usersBucketId;
  public columns: Column[] = [];
  
  constructor(private auth: AuthService) {
    Bucket.initialize({identity: auth.currentUserJWT, publicUrl: environment.publicUrl});
  }


  getColumn(id: string){
    return this
  }
  /**
   * Creates a new column for the current user
   */
  async createColumn(data: Column) {
    const user = await this.auth.currentUser;
    return await Bucket.data.insert(this.columnsBucketId, {
      ...data,
      uid: user._id,
      tasks: []
    });
  }

  /**
   * Delete column
   */
  deleteColumn(columnId: string) {
    return Bucket.data.remove(this.columnsBucketId,columnId);
  }

  /**
   * Updates the tasks on column
   */
  updateTasks(columnId: string, tasks: Task[]) {
    return Bucket.data.patch(this.columnsBucketId,columnId,{tasks});
  }

  /**
   * Get all columns owned by current user
   */
  getUserColumns() {
    return Bucket.data.realtime.getAll(this.columnsBucketId,{filter: `uid=='${this.auth.currentUser._id}'`, sort: {priority: 1}})
  }

  /**
   * Run a batch write to change the priority of each column for sorting
   */
  sortColumns(columns: Column[]) {
    columns.forEach((column,index) => {
      Bucket.data.patch(this.columnsBucketId, column._id, {priority: index})
    });
  }
}
