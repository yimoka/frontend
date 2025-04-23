import { KeyDownEvent, KeyUpEvent } from '../events';
import { Engine } from '../models';

export const useKeyboardEffect = (engine: Engine) => {
  engine.subscribeTo(KeyDownEvent, (event) => {
    const { keyboard } = engine;
    if (!keyboard) return;
    const workspace =      engine.workbench.activeWorkspace || engine.workbench.currentWorkspace;
    keyboard.handleKeyboard(event, workspace.getEventContext());
  });

  engine.subscribeTo(KeyUpEvent, (event) => {
    const { keyboard } = engine;
    if (!keyboard) return;
    const workspace =      engine.workbench.activeWorkspace || engine.workbench.currentWorkspace;
    keyboard.handleKeyboard(event, workspace.getEventContext());
  });
};
