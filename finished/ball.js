import {BehaviorSubject, filter, fromEvent, map} from "../snowpack/pkg/rxjs.js";
import {BALL_COLOR, BALL_INITIAL_SPEED} from "../shared/settings.js";
import {drawCircle} from "../shared/utils.js";
export const createBallSubject = (initialBall, canvas) => {
  const subject = new BehaviorSubject(initialBall);
  const startMovingEvents$ = fromEvent(canvas, "click").pipe(filter(() => subject.getValue().speed === 0), map(() => ({...initialBall, speed: BALL_INITIAL_SPEED})));
  startMovingEvents$.subscribe(subject);
  return subject;
};
export const renderBall = (canvasContext, {x, y, radius}) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius,
    color: BALL_COLOR
  });
};
