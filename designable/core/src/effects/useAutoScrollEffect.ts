import {
  calcAutoScrollBasicInfo,
  scrollAnimate,
  IAutoScrollBasicInfo,
  IPoint,
  Point,
} from '@yimoka/designable-shared';

import { DragMoveEvent, DragStartEvent, DragStopEvent } from '../events';
import { Engine, CursorStatus, CursorType, Viewport } from '../models';

export const useAutoScrollEffect = (engine: Engine) => {
  let xScroller: IAutoScrollBasicInfo = null;
  let yScroller: IAutoScrollBasicInfo = null;
  let xScrollerAnimationStop = null;
  let yScrollerAnimationStop = null;

  const scrolling = (point: IPoint, viewport: Viewport) => {
    if (engine.cursor.status === CursorStatus.Dragging) {
      xScroller = calcAutoScrollBasicInfo(point, 'x', viewport.rect);
      yScroller = calcAutoScrollBasicInfo(point, 'y', viewport.rect);
      if (xScroller) {
        if (xScrollerAnimationStop) {
          xScrollerAnimationStop();
        }
        xScrollerAnimationStop = scrollAnimate(
          viewport.scrollContainer,
          'x',
          xScroller.direction,
          xScroller.speed,
        );
      } else {
        if (xScrollerAnimationStop) {
          xScrollerAnimationStop();
        }
      }
      if (yScroller) {
        if (yScrollerAnimationStop) {
          yScrollerAnimationStop();
        }
        yScrollerAnimationStop = scrollAnimate(
          viewport.scrollContainer,
          'y',
          yScroller.direction,
          yScroller.speed,
        );
      } else {
        if (yScrollerAnimationStop) {
          yScrollerAnimationStop();
        }
      }
    }
  };

  engine.subscribeTo(DragStartEvent, (event) => {
    if (
      engine.cursor.type !== CursorType.Move
      && engine.cursor.type !== CursorType.Selection
    ) return;
    engine.workbench.eachWorkspace((workspace) => {
      const { viewport } = workspace;
      const { outline } = workspace;
      const point = new Point(event.data.topClientX, event.data.topClientY);
      if (
        !viewport.isPointInViewport(point)
        && !outline.isPointInViewport(point)
      ) return;
      engine.cursor.setDragStartScrollOffset({
        scrollX: viewport.scrollX,
        scrollY: viewport.scrollY,
      });
    });
  });

  engine.subscribeTo(DragMoveEvent, (event) => {
    if (
      engine.cursor.type !== CursorType.Move
      && engine.cursor.type !== CursorType.Selection
    ) return;
    engine.workbench.eachWorkspace((workspace) => {
      const { viewport } = workspace;
      const { outline } = workspace;
      const point = new Point(event.data.topClientX, event.data.topClientY);
      if (outline.isPointInViewport(point)) {
        scrolling(point, outline);
      } else if (viewport.isPointInViewport(point)) {
        scrolling(point, viewport);
      }
    });
  });
  engine.subscribeTo(DragStopEvent, () => {
    if (
      engine.cursor.type !== CursorType.Move
      && engine.cursor.type !== CursorType.Selection
    ) return;
    xScroller = null;
    yScroller = null;
    if (xScrollerAnimationStop) {
      xScrollerAnimationStop();
    }
    if (yScrollerAnimationStop) {
      yScrollerAnimationStop();
    }
  });
};
