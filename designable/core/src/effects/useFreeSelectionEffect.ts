import {
  calcRectByStartEndPoint,
  isCrossRectInRect,
  isRectInRect,
  Point,
  IRect,
} from '@yimoka/designable-shared';

import { DragStopEvent } from '../events';
import { Engine, CursorType, TreeNode } from '../models';

export const useFreeSelectionEffect = (engine: Engine) => {
  engine.subscribeTo(DragStopEvent, (_event) => {
    if (engine.cursor.type !== CursorType.Selection) return;
    engine.workbench.eachWorkspace((workspace) => {
      const { viewport } = workspace;

      // 安全检查，确保所有需要的值都存在
      if (!engine.cursor.dragStartPosition?.topClientX
        || !engine.cursor.dragStartPosition?.topClientY
        || !engine.cursor.position?.topClientX
        || !engine.cursor.position?.topClientY) {
        return;
      }

      const dragStartPoint = new Point(
        engine.cursor.dragStartPosition.topClientX,
        engine.cursor.dragStartPosition.topClientY,
      );
      const dragStartOffsetPoint = viewport.getOffsetPoint(new Point(
        engine.cursor.dragStartPosition.topClientX,
        engine.cursor.dragStartPosition.topClientY,
      ));
      const dragEndOffsetPoint = viewport.getOffsetPoint(new Point(
        engine.cursor.position.topClientX,
        engine.cursor.position.topClientY,
      ));
      if (!viewport.isPointInViewport(dragStartPoint, false)) return;
      const { tree } = workspace.operation;

      // 安全检查滚动偏移
      const scrollXOffset = engine.cursor.dragStartScrollOffset?.scrollX || 0;
      const scrollYOffset = engine.cursor.dragStartScrollOffset?.scrollY || 0;

      const selectionRect = calcRectByStartEndPoint(
        dragStartOffsetPoint,
        dragEndOffsetPoint,
        viewport.scrollX - scrollXOffset,
        viewport.scrollY - scrollYOffset,
      );

      const selected: [TreeNode, DOMRect][] = [];
      tree.eachChildren((node) => {
        const nodeRect = viewport.getValidNodeOffsetRect(node);
        if (nodeRect && isCrossRectInRect(selectionRect, nodeRect as IRect)) {
          selected.push([node, nodeRect]);
        }
      });

      const selectedNodes: TreeNode[] = selected.reduce<TreeNode[]>(
        (buf, [node, nodeRect]) => {
          if (isRectInRect(nodeRect as IRect, selectionRect)) {
            if (selected.some(([selectNode]) => selectNode.isMyParents(node))) {
              return buf;
            }
          }
          return [...buf, node];
        },
        [],
      );

      workspace.operation.selection.batchSafeSelect(selectedNodes);
    });
    engine.cursor.setType(CursorType.Move);
  });
};
