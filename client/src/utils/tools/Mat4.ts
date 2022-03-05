/**
 * ! D3D 中是行主序、OpenGL是列主序
 * ⬇️ 都是 mat4
 */

/**
 * 格式化列主序的矩阵
 * @param _mat 列主序的矩阵
 * @returns 格式化之后的矩阵
 */
const getFormatedMat = (_mat: Float32Array): number[][] => {
  return new Array(4)
    .map((_, index) => index)
    .reduce((mat: number[][], row: number) => {
      mat.push(Array.from(_mat.filter((_, index) => (index - row) % 4 == 0)));
      return mat;
    }, []);
};

/**
 * 单位矩阵
 * @param _taget
 */
export const Identity = (_target: Float32Array): Float32Array =>
  new Float32Array(
    (_target || new Float32Array(16)).map((item, index) =>
      index % 5 == 0 ? 1 : 0,
    ),
  );

/**
 * 将一个列主序的弱类型数组初始化成矩阵
 * @param source 源数据，包含16个元素
 * @param target 目标数组，将目标数组初始化成source对应的元素
 * @returns
 * * 如果source 不为空，返回该数组对应的强类型数组矩阵
 * * 如果 source 为空，返回单位矩阵
 */
export const initialize = (
  source: number[],
  target: Float32Array,
): Float32Array => {
  if (source) {
    if (target) {
      for (let i = 0; i < source.length; ++i) {
        target[i] = source[i];
      }
      return target;
    }
    return new Float32Array(source);
  }
  return Identity(target);
};

/**
 * 矩阵相加
 * @param m1 操作符左边的矩阵
 * @param m2 操作符右边的矩阵
 * @param _target 将结果存入
 */
export const addMatrix = (
  m1: Float32Array,
  m2: Float32Array,
  _target?: Float32Array,
): Float32Array => {
  const target = _target ?? new Float32Array(16);
  for (let i = 0; i < m2.length; ++i) {
    target[i] = m1[i] + m2[i];
  }
  return target;
};

/**
 * 矩阵相减
 * @param m1 操作符左边的矩阵
 * @param m2 操作符右边的矩阵
 * @param _target 将结果存入
 */
export const subMatrix = (
  m1: Float32Array,
  m2: Float32Array,
  _target?: Float32Array,
): Float32Array => {
  const target = _target ?? new Float32Array(16);
  for (let i = 0; i < m2.length; ++i) {
    target[i] = m1[i] - m2[i];
  }
  return target;
};

/**
 * 矩阵乘法
 * @param m1 操作符左边的矩阵
 * @param m2 操作符右边的矩阵
 * @param _target 将结果存入
 */
export const multiplyMartix = (
  m1: Float32Array,
  m2: Float32Array,
  _target?: Float32Array,
): Float32Array => {
  let target = _target ?? new Float32Array(16);
  const _m1 = getFormatedMat(m1),
    _m2 = getFormatedMat(m2);
  target = new Float32Array(
    _m1
      .map((row) =>
        row.map((_, i) =>
          row.reduce((sum, cell, j) => sum + cell * _m2[j][i], 0),
        ),
      )
      .flatMap((item) => item),
  );
  return target;
};

/**
 * 矩阵 * 标量
 * @param m 矩阵
 * @param scalar 标量
 */
export const multiplyScalar = (
  m: Float32Array,
  scalar: number,
): Float32Array => {
  if (scalar === undefined || scalar === null) {
    return m;
  }
  for (let i = 0; i < m.length; i++) {
    m[i] *= scalar;
  }
  return m;
};

/**
 * 矩阵转置
 * @param mat 矩阵
 */
export const transpose = (mat: Float32Array): Float32Array => {
  const _mat = getFormatedMat(mat);
  for (let i = 0; i < _mat.length; ++i) {
    for (let j = 0; j < i; ++j) {
      _mat[i][j] = _mat[i][j] ^ _mat[j][i];
      _mat[j][i] = _mat[i][j] ^ _mat[j][i];
      _mat[i][j] = _mat[i][j] ^ _mat[j][i];
    }
  }
  return new Float32Array(_mat.flatMap((item) => item));
};
