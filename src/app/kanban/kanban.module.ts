import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { KanbanRoutingModule } from "./kanban-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ColumnListComponent } from "./column-list/column-list.component";
import { ColumnComponent } from "./column/column.component";
import { ColumnDialogComponent } from "./dialogs/column-dialog.component";
import { TaskDialogComponent } from "./dialogs/task-dialog.component";

@NgModule({
  declarations: [
    ColumnListComponent,
    ColumnComponent,
    ColumnDialogComponent,
    TaskDialogComponent
  ],
  imports: [
    CommonModule,
    KanbanRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule
  ],
  entryComponents: [ColumnDialogComponent, TaskDialogComponent]
})
export class KanbanModule {}
