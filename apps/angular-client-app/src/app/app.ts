import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'client-root',
  template: `<h1>Welcome angular-client-app</h1>
    <router-outlet></router-outlet>`,
  styles: ``,
})
export class App {}
