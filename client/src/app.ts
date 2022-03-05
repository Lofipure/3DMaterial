export const render = async (oldRender: () => void): Promise<void> => {
  oldRender();
};
