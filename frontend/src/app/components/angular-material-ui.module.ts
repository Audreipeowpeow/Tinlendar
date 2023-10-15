import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

const angularMaterialUiModules = [
  MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...angularMaterialUiModules],
  exports: [...angularMaterialUiModules],
})
export class AngularMaterialUiModule {}
