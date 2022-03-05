/**
 * Create WebGL Shader Program
 * @param {WebGLRenderingContext} gl WebGL Context
 * @param {string} vertexShaderSource Vertex Shader Source
 * @param {string} fragmentShaderSource Fragment Shader Source
 * @returns {WebGLProgram} The GLSL Program
 */

export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return program;
};
