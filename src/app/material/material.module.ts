import { NgModule } from '@angular/core';
import { MatButtonModule , MatInputModule} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';    
import {MatProgressBarModule} from '@angular/material/progress-bar';

const MaterialModules = [
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatMenuModule,
      MatDialogModule,
      MatCardModule,
      MatToolbarModule,
      MatTableModule,
      MatProgressBarModule
]

@NgModule({
  imports: [ MaterialModules ],
  exports: [ MaterialModules ]
})
export class MaterialModule { }
