import { Component, OnInit, OnDestroy } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Subscription } from "rxjs";
import { Column } from "../column.model";
import { ColumnService } from "../column.service";
import { MatDialog } from "@angular/material/dialog";
import { ColumnDialogComponent } from "../dialogs/column-dialog.component";

@Component({
  selector: "app-column-list",
  templateUrl: "./column-list.component.html",
  styleUrls: ["./column-list.component.scss"]
})
export class ColumnListComponent implements OnInit, OnDestroy {
  columns: Column[];
  sub;

  constructor(public columnService: ColumnService, public dialog: MatDialog) {}

  ngOnInit() {
    this.sub = this.columnService
      .getUserColumns()
      .subscribe((columns: Column[]) => {
        this.columns = columns;
        this.columnService.columns = this.columns;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columnService.sortColumns(this.columns);
  }

  openColumnDialog(): void {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: "400px",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columnService.createColumn({
          title: result,
          priority: this.columns.length
        });
      }
    });
  }
}
