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
  @ViewChild('target') target!: ElementRef;
  searchedUser!: User;
  userId: string = '';
  form: FormGroup;
  users!: User[];
  editToggle: boolean = false;
  addToggle: boolean = false;

  constructor(fb: FormBuilder, private usersApis: UserService) {
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

  ngOnInit(): void {
    this.usersApis.getAll().subscribe({
      next: (usersFromDB) => (this.users = usersFromDB as User[]),
    });
  }

  addUser() {
    if (this.form.invalid) {
      this.form.setErrors({ invalid: true });
      this.form.markAllAsTouched();
      this.target.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.form.setErrors({ invalid: true });
    let user = this.form.value as User;
    this.users = [user, ...this.users];
    this.usersApis.create(this.form.value).subscribe({
      next: (newUser) => {
        user.id = newUser.id;
      },
      error: () => this.users.splice(this.users.length - 1, 1),
    });
    this.form.reset();
  }

  searchById() {
    if (this.userId == '') {
      alert('Please enter user id!');
      return;
    }
    this.usersApis.getById(this.userId).subscribe({
      next: (user) => {
        this.searchedUser = user as User;
        this.userId = '';
      },
    });
  }

  editUser(user: User) {
    if (this.editToggle) this.editToggle = !this.editToggle;
    if (!this.editToggle) this.editToggle = !this.editToggle;
    this.target.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.form.patchValue(user);
    this.form.markAllAsTouched();
  }

  cancelEdit() {
    this.form.reset();
    this.editToggle = !this.editToggle;
  }

  updateUser() {
    if (this.form.invalid) {
      this.form.setErrors({ invalid: true });
      return;
    }
    this.editToggle = !this.editToggle;
    this.usersApis.update(this.form.value).subscribe({
      next: (updatedUser) => {
        this.users = this.users.map((user) => {
          if (user.id == (updatedUser as User).id) return updatedUser as User;
          return user;
        });
        this.form.reset();
      },
    });
  }

  deleteUser(user: User) {
    this.users.splice(this.users.indexOf(user), 1);
    this.usersApis.delete(user.id).subscribe({
      error: () => this.users.splice(this.users.indexOf(user), 0, user),
    });
  }
}
