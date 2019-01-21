import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent, relationPopUp } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JdmService } from '../services/jdm.service';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    relationPopUp
  ],
  imports: [
    BrowserModule,NgxSpinnerModule,
    FormsModule,HttpModule,
    AppRoutingModule,
    MatDialogModule,BrowserAnimationsModule,
    AppRoutingModule
  ],
  entryComponents: [
    relationPopUp
  ],
  providers: [JdmService,{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
