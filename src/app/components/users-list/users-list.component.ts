import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  // @ViewChild('target') target!: ElementRef;
  form: FormGroup;
  users!: User[];
  searchedUser!: User;
  userId: string = '';
  editToggle: boolean = false;

  constructor(fb: FormBuilder, private usersApi: UserService) {
    this.form = fb.group({
      id: [''],
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

  editUser(user: User) {
    if (this.editToggle) {
      this.editToggle = !this.editToggle;
      this.form.reset();
    } else {
      // make all fields touchd to get all errors
      this.form.patchValue(user);
      this.editToggle = !this.editToggle;
    }
  }

  cancelEdit() {
    console.log(this.form.value);
    this.form.reset();
    this.editToggle = !this.editToggle;
  }

  updateUser() {
    if (this.form.invalid) {
      this.form.setErrors({ invalid: true });
      return;
    }
    this.users = this.users.map((user) => {
      if (user.id == this.form.value.id) return this.form.value;
      return user;
    });
    this.editToggle = !this.editToggle;
    this.usersApi.update(this.form.value).subscribe({
      next: (newUser) => {
        console.log(newUser);
        this.form.reset();
      },
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
    if (this.editToggle) {
      alert('please Submit or cancel your Edit ');
      return;
    }
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
    this.users.splice(this.users.indexOf(user), 1);
    this.usersApi.delete(user.id).subscribe({
      error: (error) => {
        this.users.splice(this.users.indexOf(user), 0, user);
        console.log(error);
      },
    });
  }
}
