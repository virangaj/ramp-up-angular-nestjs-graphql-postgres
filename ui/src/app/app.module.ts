import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InMemoryCache } from '@apollo/client/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UploadComponent } from '@progress/kendo-angular-upload';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [AppComponent, FileUploadComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    CommonModule,
    ReactiveFormsModule,
    UploadComponent,
  ],
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: environment.GRAPHQL_GATEWAY }),
        cache: new InMemoryCache(),
      };
    }),
    provideAnimations(),
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
