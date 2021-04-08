import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ColumnListComponent } from "./column-list/column-list.component";

const routes: Routes = [{ path: "", component: ColumnListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KanbanRoutingModule {}
