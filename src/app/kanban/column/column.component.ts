import { Component, Input } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ColumnService } from "../column.service";
import { Task, Column } from "../column.model";
import { MatDialog } from "@angular/material/dialog";
import { TaskDialogComponent } from "../dialogs/task-dialog.component";

@Component({
  selector: "app-column",
  templateUrl: "./column.component.html",
  styleUrls: ["./column.component.scss"]
})
export class ColumnComponent {
  @Input() column: Column;
  dropListIds: string[];
  currentColumnId: string;

  constructor(private columnService: ColumnService, private dialog: MatDialog) {}

  ngOnInit(){
    this.dropListIds = this.columnService.columns.map((column,index) => {
      if(column._id == this.column._id)
        this.currentColumnId = "cdk-drop-list-0" + (index + 1);
      return "cdk-drop-list-0" + (index + 1)
    });
  }

  taskDrop(event: CdkDragDrop<string[]>) {
    if(event.previousContainer.data == event.container.data){
      moveItemInArray(this.column.tasks, event.previousIndex, event.currentIndex);
      this.columnService.updateTasks(this.column._id, this.column.tasks);
    }else{
      let otherColumn = this.columnService.columns.filter(column => column._id == event.previousContainer.data.toString())[0];
      this.column.tasks.splice(event.currentIndex, 0, otherColumn.tasks[event.previousIndex]);
      otherColumn.tasks.splice(event.previousIndex,1);
      this.columnService.updateTasks(otherColumn._id, otherColumn.tasks);
      this.columnService.updateTasks(this.column._id, this.column.tasks);
    }
  }

  openDialog(task?: Task, idx?: number): void {
    const newTask = { label: "purple" };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: "500px",
      data: task
        ? { task: { ...task }, isNew: false, columnId: this.column._id, idx }
        : { task: newTask, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isNew) {
          this.columnService.updateTasks(this.column._id, [
            ...this.column.tasks,
            result.task
          ]);
        } else {
          const update = this.column.tasks;
          update.splice(result.idx, 1, result.task);
          this.columnService.updateTasks(this.column._id, this.column.tasks);
        }
      }
    });
  }

  handleDelete() {
    this.columnService.deleteColumn(this.column._id);
  }
}
