import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './services/user.service';
import { PostService } from './services/post.service';

import { AppComponent } from './app.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ErrorComponent } from './components/error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostsComponent } from './components/posts/posts.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    UsersListComponent,
    ErrorComponent,
    UsersTableComponent,
    NavbarComponent,
    NotFoundComponent,
    PostsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    RouterModule.forRoot([
      { path: 'first-task', component: PostsComponent },
      { path: 'second-task', component: UsersListComponent },
      { path: '**', component: NotFoundComponent },
    ]),
  ],
  providers: [UserService, PostService],
  bootstrap: [AppComponent],
})
export class AppModule {}
