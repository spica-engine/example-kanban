import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-column-dialog",
  template: `
    <h1 mat-dialog-title>Column</h1>
    <div matDialogContent>
      <p>What shall we call this column?</p>
      <mat-form-field>
        <input placeholder="title" matInput [(ngModel)]="data.title" />
      </mat-form-field>
    </div>
    <div matDialogActions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data.title" cdkFocusInitial>
        Create
      </button>
    </div>
  `,
  styleUrls: ["./column-dialog.component.scss"]
})
export class ColumnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
