export default class Vector3 {
  private x: number;
  private y: number;
  private z: number;

  constructor(x?: number, y?: number, z?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  setX(x: number): Vector3 {
    this.x = x ?? 0;
    return this;
  }

  setY(y: number): Vector3 {
    this.y = y ?? 0;
    return this;
  }

  setZ(z: number): Vector3 {
    this.z = z ?? 0;
    return this;
  }

  getX = (): number => this.x;
  getY = (): number => this.y;
  getZ = (): number => this.z;

  /**
   * 归一化向量
   */
  normalize(): Vector3 {
    const length = Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2),
    );
    return length > 0.000001
      ? new Vector3(this.x / length, this.y / length, this.z / length)
      : new Vector3();
  }

  /**
   * 向量相加
   */
  addVector(vec: Vector3): Vector3 {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }
  static add(vec1: Vector3, vec2: Vector3): Vector3 {
    return new Vector3(vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z);
  }

  /**
   * 向量相减
   */
  subVector(vec: Vector3): Vector3 {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }
  static sub(vec1: Vector3, vec2: Vector3): Vector3 {
    return new Vector3(vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z);
  }

  /**
   * 向量乘标量
   */
  multiplyScalar(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  /**
   * 向量乘向量
   */
  multiplyVector(vec: Vector3): Vector3 {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
    return this;
  }
  static multiply(vec1: Vector3, vec2: Vector3): Vector3 {
    return new Vector3(vec1.x * vec2.x, vec1.y * vec2.y, vec1.z * vec2.z);
  }

  /**
   * 点乘
   */
  dotVector(vec: Vector3): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }
  static dot(vec1: Vector3, vec2: Vector3): number {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  }

  /**
   * 叉乘
   */
  static cross(vec1: Vector3, vec2: Vector3): Vector3 {
    return new Vector3(
      vec1.y * vec2.z - vec2.y * vec1.z,
      vec2.x * vec1.z - vec1.x * vec2.z,
      vec1.x * vec2.y - vec1.y * vec2.x,
    );
  }
}
