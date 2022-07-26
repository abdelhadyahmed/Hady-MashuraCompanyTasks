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
  form!: FormGroup;
  users!: User[];
  editToggle: boolean = false;
  addToggle: boolean = false;
  isSuccessAdding: boolean = false;
  isSuccessEdit: boolean = false;

  constructor(private fb: FormBuilder, private usersApis: UserService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      username: ['', [Validators.required, UserValidators.canNotContainSpace]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
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
      company: this.fb.group({
        name: ['', Validators.required],
      }),
    });

    this.usersApis.getAll().subscribe({
      next: (usersFromDB) => (this.users = usersFromDB as User[]),
    });
  }

  openUserForm() {
    this.addToggle = !this.addToggle;
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
        this.isSuccessAdding = true;
        setTimeout(() => {
          this.isSuccessAdding = false;
        }, 4000);
      },
      error: () => this.users.splice(this.users.length - 1, 1),
    });
    this.form.reset();
    if (this.addToggle) this.addToggle = false;
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
    if (!this.addToggle) this.addToggle = true;
    if (this.editToggle) this.editToggle = false;
    if (!this.editToggle) this.editToggle = true;
    this.target.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.form.patchValue(user);
    this.form.markAllAsTouched();
  }

  cancelEdit() {
    if (this.addToggle) this.addToggle = false;
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
        this.isSuccessEdit = true;
        setTimeout(() => {
          this.isSuccessEdit = false;
        }, 4000);
      },
    });
    this.addToggle = false;
  }

  deleteUser(user: User) {
    if (
      !confirm(
        `Are you sure to delete this user with name: ${user.name}! \n This will be a permenant delete!`
      )
    ) {
      return;
    }
    this.users.splice(this.users.indexOf(user), 1);
    this.usersApis.delete(user.id).subscribe({
      error: () => this.users.splice(this.users.indexOf(user), 0, user),
    });
  }
}
