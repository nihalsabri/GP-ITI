import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule,RouterOutlet,Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
