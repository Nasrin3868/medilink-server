// primeng.module.ts
import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    MenubarModule,
    ToolbarModule,
    PanelMenuModule,
    ListboxModule,
    ButtonModule
  ],
  exports: [
    MenubarModule,
    ToolbarModule,
    PanelMenuModule,
    ListboxModule,
    ButtonModule
  ]
})
export class PrimeNGModule { }
