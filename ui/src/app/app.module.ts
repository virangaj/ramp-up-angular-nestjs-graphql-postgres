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
import { UploadInterceptor } from './upload.interceptor';
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
        link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
        cache: new InMemoryCache(),
      };
    }),
    provideAnimations(),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: UploadInterceptor,
    //   multi: true,
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
