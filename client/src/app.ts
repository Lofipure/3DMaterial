import "@/assets/styles/index.less";

export const render = async (oldRender: () => void): Promise<void> => {
  oldRender();
};
