import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  records: any[] = [];
  allUsers: any[] = [];
  
  loadingRecords = false;
  loadingUsers = false;
  recordDelay = 2500;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.userService.currentUserValue;
    this.loadUserData();
  }

  loadUserData() {
    this.loadingRecords = true;
    this.userService.getRecords(this.recordDelay).subscribe(data => {
      this.records = data;
      this.loadingRecords = false;
    });

    if (this.currentUser.role === 'Admin') {
      this.loadingUsers = true;
      this.userService.getAllUsers().subscribe(data => {
        this.allUsers = data;
        this.loadingUsers = false;
      });
    }
  }

  deleteUser(id: string) {
    if(confirm("Are you sure you want to delete this user entry?")) {
      this.userService.deleteUser(id).subscribe(() => {
        this.allUsers = this.allUsers.filter(u => u.id !== id);
      });
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
