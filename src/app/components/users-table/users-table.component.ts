import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/types/user';

@Component({
  selector: 'users-table',
  styleUrls: ['users-table.component.css'],
  templateUrl: 'users-table.component.html',
})
export class UsersTableComponent {
  @Input('users') users?: User[];
  // @Input('searchedUser') searchedUser?: User[];
  @Output('editEvent') editEvent = new EventEmitter();
  @Output('deletEvent') deletEvent = new EventEmitter();

  onEdit(user: User) {
    this.editEvent.emit(user);
  }
  onDelete(user: User) {
    this.deletEvent.emit(user);
  }
}
