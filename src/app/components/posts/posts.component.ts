import { Component } from '@angular/core';
import { Post } from 'src/app/types/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  postTitle: string = '';
  posts: Post[] = [];
  editPostTitle?: Post;

  onSubmitPost() {
    if (!this.editPostTitle) {
      if (!this.postTitle) {
        alert('Please enter Post Title');
        return;
      }
      this.posts = [
        ...this.posts,
        { id: this.posts.length + 1, title: this.postTitle },
      ];
      this.postTitle = '';
    } else {
      alert(
        `Please Save your updates for post title ${this.editPostTitle.title.substring(
          0,
          20
        )}....`
      );
      return;
    }
  }

  updatePost(post: Post) {
    this.editPostTitle = post;
    this.postTitle = post.title;
  }

  saveUpdate() {
    if (!this.postTitle) {
      alert("Please don't leave Post Title Empty!");
      return;
    }
    this.editPostTitle!.title = this.postTitle;
    this.editPostTitle = undefined;
    this.postTitle = '';
  }

  cancelUpdate() {
    this.editPostTitle = undefined;
    this.postTitle = '';
  }

  deletePost(post: Post) {
    this.posts = this.posts.filter((p) => p.id !== post.id);
  }
}
