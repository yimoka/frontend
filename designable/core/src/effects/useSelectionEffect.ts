import { KeyCode, Point } from '@yimoka/designable-shared';
import { IAny } from '@yimoka/shared';

import { MouseClickEvent } from '../events';
import { Engine, CursorStatus } from '../models';

export const useSelectionEffect = (engine: Engine) => {
  engine.subscribeTo(MouseClickEvent, (event) => {
    if (engine.cursor.status !== CursorStatus.Normal) return;
    const target: HTMLElement = event.data.target as IAny;
    const el = target?.closest?.(`
      *[${engine.props.nodeIdAttrName}],
      *[${engine.props.outlineNodeIdAttrName}]
    `);
    const isHelpers = target?.closest?.(`*[${engine.props.nodeSelectionIdAttrName}]`);
    const currentWorkspace = event.context?.workspace ?? engine.workbench.activeWorkspace;
    if (!currentWorkspace) return;
    if (!el?.getAttribute) {
      const point = new Point(event.data.topClientX, event.data.topClientY);
      const { operation } = currentWorkspace;
      const { viewport } = currentWorkspace;
      const { outline } = currentWorkspace;
      const isInViewport = viewport.isPointInViewport(point, false);
      const isInOutline = outline.isPointInViewport(point, false);
      if (isHelpers) return;
      if (isInViewport || isInOutline) {
        const { selection } = operation;
        const { tree } = operation;
        selection.select(tree);
      }
      return;
    }
    const nodeId = el.getAttribute(engine.props.nodeIdAttrName);
    const structNodeId = el.getAttribute(engine.props.outlineNodeIdAttrName);
    const { operation } = currentWorkspace;
    const { selection } = operation;
    const { tree } = operation;
    const node = tree.findById(nodeId || structNodeId);
    if (node) {
      engine.keyboard.requestClean();
      if (
        engine.keyboard.isKeyDown(KeyCode.Meta)
        || engine.keyboard.isKeyDown(KeyCode.Control)
      ) {
        if (selection.has(node)) {
          if (selection.selected.length > 1) {
            selection.remove(node);
          }
        } else {
          selection.add(node);
        }
      } else if (engine.keyboard.isKeyDown(KeyCode.Shift)) {
        if (selection.has(node)) {
          if (selection.selected.length > 1) {
            selection.remove(node);
          }
        } else {
          selection.crossAddTo(node);
        }
      } else {
        selection.select(node);
      }
    } else {
      selection.select(tree);
    }
  });
};
