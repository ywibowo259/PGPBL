import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { EditpointRoutingModule } from './editpoint-routing.module';

import { EditpointPage } from './editpoint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditpointRoutingModule
  ],
  declarations: [EditpointPage]
})
export class EditpointPageModule {}
