import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/types/user';
import { UserValidators } from 'src/app/validators/user.validators';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  form: FormGroup;
  users!: User[];
  searchedUser!: User;
  userId: string = '';

  constructor(fb: FormBuilder, private usersApi: UserService) {
    this.form = fb.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, UserValidators.canNotContainSpace]],
      email: ['', [Validators.required, Validators.email]],
      address: fb.group({
        street: ['', Validators.required],
        suite: ['', Validators.required],
        city: ['', Validators.required],
        zipcode: ['', Validators.required],
      }),
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*'),
          Validators.maxLength(11),
          Validators.minLength(11),
        ],
      ],
      website: ['', Validators.required],
      company: fb.group({
        name: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.usersApi.getAll().subscribe({
      next: (usersFromDB) => {
        this.users = usersFromDB as User[];
      },
    });
  }

  addUser(target: HTMLElement) {
    if (this.form.invalid) {
      this.form.setErrors({ invalid: true });
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.form.setErrors({ invalid: true });
    this.users = [...this.users, this.form.value as User];
    this.usersApi.create(this.form.value).subscribe({
      error: (error) => {
        this.users.splice(this.users.length - 1, 1);
        console.log(error);
      },
    });
    // console.log(this.form.value);
    this.form.reset();
  }

  searchById() {
    if (this.userId == '') {
      alert('Please enter user id!');
      return;
    }
    this.usersApi.getById(this.userId).subscribe({
      next: (user) => {
        this.searchedUser = user as User;
        this.userId = '';
      },
      error: (error: Response) => {
        if (error.status === 404)
          alert('This user not found or it would be deleted!');
      },
    });
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
