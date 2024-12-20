import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed = true;

  menuItems = [
    { title: 'Static Map', subMenu: null },
    { title: 'Dynamic map', subMenu:null, isOpen: false },
    { title: 'SB1', subMenu: null },
    { title: 'SB2', subMenu: null },
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubMenu(item: any): void {
    if (item.subMenu) {
      item.isOpen = !item.isOpen;
    }
  }
}
