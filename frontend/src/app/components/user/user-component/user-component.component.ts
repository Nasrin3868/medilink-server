import { Component, ViewChild } from '@angular/core';
import { UserSideBarComponent } from '../user-side-bar/user-side-bar.component';

@Component({
  selector: 'app-user-component',
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.css']
})
export class UserComponentComponent {
  // Reference the child sidebar component using the local template variable #sidebarComponent
    @ViewChild('sidebarComponent') sidebarComponent!: UserSideBarComponent; 

    // Property to track mobile sidebar state for the backdrop
    get isSidebarOpen(): boolean {
        return this.sidebarComponent ? this.sidebarComponent.isSidebarOpen : false;
    }

    // Method to toggle the mobile sidebar state in the child component
    toggleMobileSidebar() {
        if (this.sidebarComponent) {
            this.sidebarComponent.toggleSidebar();
        }
    }
}
