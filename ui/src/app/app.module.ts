import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
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
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: 'http://localhost:3001/graphql' }),
        cache: new InMemoryCache(),
      };
    }),
    provideAnimations(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
