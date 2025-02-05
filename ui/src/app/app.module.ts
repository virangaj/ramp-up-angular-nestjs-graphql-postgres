import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UploadComponent } from '@progress/kendo-angular-upload';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatProgressBarModule} from '@angular/material/progress-bar';
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};
@NgModule({
  declarations: [AppComponent, FileUploadComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    CommonModule,
    ReactiveFormsModule,
    UploadComponent,
    MatProgressBarModule,
  ],
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: environment.GRAPHQL_GATEWAY }),
        cache: new InMemoryCache(),
        defaultOptions: defaultOptions,
      };
    }),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
