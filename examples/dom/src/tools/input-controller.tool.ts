export type KeyNumber = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type KeySpecial = 'ENTER';

export type KeyDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type KeyEventCode = KeyNumber | KeySpecial | KeyDirection;

export interface InputControllerHookOptions {
  delay?: {
    /**
     * Time in milliseconds
     * @default 300
     */
    max: number;
    /**
     * Time in milliseconds
     * @default 200
     */
    min: number;
    /**
     * Time in milliseconds
     * @default 10
     */
    acceleration: number;
  };
  /**
   * Triggered when a Number Key is pressed
   */
  onNumber?: (value: number) => void;
  /**
   * Triggered when the Enter Key is pressed
   */
  onEnter?: () => void;
  /**
   * Triggered when the Up Key is pressed
   */
  onUp?: () => void;
  /**
   * Triggered when the Down Key is pressed
   */
  onDown?: () => void;
  /**
   * Triggered when the Left Key is pressed
   */
  onLeft?: () => void;
  /**
   * Triggered when the Right Key is pressed
   */
  onRight?: () => void;
}

export type KeyActions = KeyDefaultAction | KeyNumberAction;

export type KeyDefaultAction = () => void;

export type KeyNumberAction = (value: number) => void;

export function useInputController(options: InputControllerHookOptions): {
  enable(): void;
  disable(): void;
} {
  const {
    delay = { min: 200, max: 300, acceleration: 10 },
    onNumber,
    onEnter,
    onUp,
    onDown,
    onLeft,
    onRight,
  } = options;

  let lastTime = 0;
  let accelerator = 0;
  let lastActionName: string | number | undefined = undefined;

  let enabled = true;
  window.addEventListener('keydown', EventHandler, true);

  function enable() {
    if (enabled) {
      return;
    }

    enabled = true;
    window.addEventListener('keydown', EventHandler, true);
  }

  function disable() {
    if (!enabled) {
      return;
    }

    enabled = false;
    window.removeEventListener('keydown', EventHandler, true);
  }

  function EventHandler(event: KeyboardEvent): void {
    const code = parseKeyCode(event.code);

    if (code === undefined) {
      return;
    }

    const action = getKeyAction(code);

    function parseKeyCode(code: string): KeyEventCode | undefined {
      if (/^[0-9]$/.test(code)) return code as KeyNumber;
      if (code === 'Enter') return 'ENTER';
      if (code === 'ArrowUp') return 'UP';
      if (code === 'ArrowDown') return 'DOWN';
      if (code === 'ArrowRight') return 'RIGHT';
      if (code === 'ArrowLeft') return 'LEFT';
    }

    if (action === undefined) {
      return;
    }

    const isSameKey = lastActionName === code;

    lastActionName = code;

    if (shouldExecuteAction()) {
      action();
      lastTime = performance.now();

      if (!isSameKey) {
        accelerator = 0;
      } else if (delay.acceleration > 0) {
        accelerator += delay.acceleration;
      }
    }
  }

  const keyActions: Record<KeyEventCode, KeyActions | undefined> = {
    '0': onNumber,
    '1': onNumber,
    '2': onNumber,
    '3': onNumber,
    '4': onNumber,
    '5': onNumber,
    '6': onNumber,
    '7': onNumber,
    '8': onNumber,
    '9': onNumber,

    ENTER: onEnter,

    UP: onUp,
    DOWN: onDown,
    LEFT: onLeft,
    RIGHT: onRight,
  };

  function getKeyAction(code: KeyEventCode): (() => void) | undefined {
    const action = keyActions[code];

    if (action === undefined) {
      return;
    }

    if (/^[0-9]$/.test(code)) {
      return (action as KeyNumberAction).bind(undefined, parseInt(code as KeyNumber, 10));
    }

    return (action as KeyDefaultAction).bind(undefined);
  }

  function shouldExecuteAction(): boolean {
    const elapsedTime = performance.now() - lastTime;

    const waitTime =
      delay.min === delay.max || delay.acceleration === 0
        ? delay.max
        : Math.max(delay.min, delay.max - accelerator);

    return elapsedTime >= waitTime;
  }

  return {
    enable,
    disable,
  };
}
