import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
        console.log('Toggle clicked, isCollapsed:', this.isCollapsed);

  }
}
