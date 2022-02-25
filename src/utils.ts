/**
 * Combines a list of actions into a single action. The actions must be able to receive the same params
 * @note Action type doesn't exist, so we have to try and define it here
 * @see https://github.com/sveltejs/svelte/pull/7121
 */
export function deriveAction<N, P>(actions: ((node: N, params?: P) => void)[]) {
  return (node: N, params: P) => {
    const update = () => {
      actions.forEach((func) => {
        func(node, params);
      });
    };
    update();
    return { update };
  };
}
