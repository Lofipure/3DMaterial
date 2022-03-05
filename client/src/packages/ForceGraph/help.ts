type PositionType = {
  x: number;
  y: number;
};

const Direction = [
  [-1, 0, 1, 0],
  [0, -1, 0, 1],
];

export const judgeIn = (
  context: CanvasRenderingContext2D,
  currentPosition: PositionType,
): boolean => {
  const nextPosition: PositionType = currentPosition;
  const currentColor = context
    .getImageData(currentPosition.x, currentPosition.y, 1, 1)
    .data.slice(0, 3)
    .join(",");
  for (let i = 0; i < 4; ++i) {
    nextPosition.x += Direction[0][i];
    nextPosition.y += Direction[1][i];
    const nextColor = context
      .getImageData(nextPosition.x, nextPosition.y, 1, 1)
      .data.slice(0, 3)
      .join(",");
    if (currentColor != nextColor) {
      return false;
    }
  }
  return true;
};
