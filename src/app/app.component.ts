import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar.component';
import { UpdateNotificationComponent } from './components/update-notification.component';

@Component({
  selector: 'app-root',
  template: `<div class="app-container">
    <app-update-notification></app-update-notification>
    <app-nav-bar></app-nav-bar>
    <main>
      <router-outlet></router-outlet>
    </main>
  </div>`,
  styles: `.fullscreen-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  .fullscreen-container .logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .fullscreen-container h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .install-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: transform 0.2s;
  }
  
  .install-button:hover {
    transform: scale(1.05);
    background-color: #0056b3;
  }
  `,
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent, UpdateNotificationComponent],
})
export class AppComponent implements OnInit {
  title = 'Home';

  constructor() {}

  ngOnInit() {}
}
