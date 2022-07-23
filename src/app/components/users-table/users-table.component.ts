import { Component, Input } from '@angular/core';
import { User } from 'src/app/types/user';

@Component({
  selector: 'users-table',
  styleUrls: ['users-table.component.css'],
  templateUrl: 'users-table.component.html',
})
export class UsersTableComponent {
  @Input('users') users?: User[];
}
