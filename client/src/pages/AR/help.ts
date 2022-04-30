export const createTemplate = (url: string): string => `
<!DOCTYPE html>
<html>
  <script src="/aframe.min.js"></script>
  <script src="/aframe-ar.js"></script>
  <style>
      .a-enter-vr-button {
          display: none;
      }
  </style>
  <body style="margin : 0px; overflow: hidden;">
      <a-scene embedded arjs>
          <a-marker preset="hiro">
              <a-entity position="0 0 0" scale="0.01 0.01 0.01" rotation="0 0 0" id="entity" gltf-model="${url}">
              </a-entity>
          </a-marker>
          <a-entity camera></a-entity>
      </a-scene>
  </body>
</html>
`;

export const copyString = (str: string): boolean => {
  const input = document.createElement("input");
  document.body.append(input);

  input.setAttribute("value", str);
  input.select();

  try {
    document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(input);
  }

  return true;
};
