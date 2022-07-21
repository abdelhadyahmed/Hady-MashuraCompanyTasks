import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  form: FormGroup;
  users!: User[];
  constructor(fb: FormBuilder, private usersApi: PostService) {
    this.form = fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    this.usersApi.getAll().subscribe({
      next: (usersFromDB) => {
        this.users = usersFromDB as User[];
        console.log(this.users);
      },
    });
  }

  get usernameField() {
    return this.form.get('username');
  }
  get passwordField() {
    return this.form.get('password');
  }

  addUser() {
    this.users = [...this.users, this.form.value as User];
    this.usersApi.create(this.form.value).subscribe({
      error: (error) => {
        this.users.splice(this.users.length - 1, 1);
        console.log(error);
      },
    });
    this.form.reset();
  }
  deleteUser(user: User) {
    let index = this.users.indexOf(user);
    this.users.splice(index, 1);
    this.usersApi.delete(user.id).subscribe({
      error: (error) => {
        this.users.splice(index, 0, user);
        console.log(error);
      },
    });
  }
}
