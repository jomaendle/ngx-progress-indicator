import {
  Component,
  computed,
  effect,
  ElementRef,
  Input,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  getCircumference,
  getClampedValue,
  getDashOffset,
} from '../../utils/circle.util';

const INITIAL_PROGRESS = 50;

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  templateUrl: './progress-indicator.component.html',
  styleUrl: './progress-indicator.component.css',
  host: { class: 'block relative' },
})
export class ProgressIndicatorComponent {
  #previousProgress = signal(0);
  #currentProgress = signal(INITIAL_PROGRESS);

  @Input() set progress(value: number) {
    const clampedValue = getClampedValue(value);
    this.#previousProgress.set(this.#currentProgress());
    this.#currentProgress.set(clampedValue);
  }

  size = input<number>(80);
  strokeWidth = input<number>(12);

  protected readonly viewBoxSize = 200 as const;
  protected readonly viewBox =
    `0 0 ${this.viewBoxSize} ${this.viewBoxSize}` as const;

  protected readonly radius = 90;
  protected readonly cx = 100;
  protected readonly cy = 100;
  protected readonly dashArray = getCircumference(this.radius);
  protected readonly currentProgress = this.#currentProgress.asReadonly();

  progressCircle = viewChild<ElementRef<SVGCircleElement>>('progressCircle');

  protected dashOffset = computed(() =>
    getDashOffset(this.radius, this.#currentProgress()),
  );

  constructor() {
    effect(() => {
      const circle = this.progressCircle()?.nativeElement;
      const previous = this.#previousProgress();
      const current = this.#currentProgress();

      if (circle && previous !== current) {
        this.#animateProgress(circle, previous);
      }
    });
  }

  #animateProgress(elem: SVGCircleElement, prev?: number): void {
    const initialOffset = prev
      ? getDashOffset(this.radius, prev)
      : this.dashArray;

    const keyframes = [
      { strokeDashoffset: initialOffset },
      { strokeDashoffset: this.dashOffset() },
    ];
    const options: KeyframeAnimationOptions = {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'forwards',
    };

    requestAnimationFrame(() => elem.animate(keyframes, options));
  }
}
