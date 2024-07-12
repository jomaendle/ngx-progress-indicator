import { Component, model } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressIndicatorComponent } from '../components/progress-indicator/progress-indicator.component';
import { getClampedValue } from '../utils/circle.util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProgressIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    class: 'flex flex-col gap-12 p-8 items-center',
  },
})
export class AppComponent {
  progress = model(50);

  updateBy10(): void {
    this.progress.update((value) => getClampedValue(value + 10));
  }

  decrementBy10(): void {
    this.progress.update((value) => getClampedValue(value - 10));
  }

  reset(): void {
    this.progress.set(0);
  }
}
