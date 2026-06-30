import { Component, DestroyRef, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, fromEvent, map, of, throttleTime } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface User {
  name: string;
  age: number;
  isActive: boolean;
}

@Component({
  selector: 'app-test',
  imports: [AsyncPipe],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  users: User[] = [
    {
      name: "John Doe",
      age: 30,
      isActive: true
    },
    {
      name: "Jane Does",
      age: 25,
      isActive: true
    }
  ]

  user$ = new BehaviorSubject<User | null>(null)

  users$ = of(this.users);
  usernames$ = this.users$.pipe(map(users => users.map(user => user.name)))
  filteredUsers$ = this.users$.pipe(filter((users) => users.every((user) => user.isActive)));


  documentClick$ = fromEvent(document, "click").pipe(
    throttleTime(1000)
  );

  data$ = combineLatest([
    this.users$,
    this.usernames$,
    this.filteredUsers$,
  ]).pipe(map(([users, usernames, filteredUsers]) => ({
    users,
    usernames,
    filteredUsers,
  })))

  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.documentClick$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        console.log('event', event);
      })

    setTimeout(() => {
      this.user$.next({
        name: "Enes Tolgay",
        age: 20,
        isActive: true,
      })
    }, 2000)

    this.user$.subscribe(user => {
      console.log('user', user);
    })

    /*  this.filteredUsers$.subscribe((filteredUsers) => {
       console.log('filteredUsers', filteredUsers)
     }) */
  }
}
