/**
 * Combines a list of actions into a single action. The actions must be able to receive the same params
 * @note Action type doesn't exist, so we have to try and define it below
 */
export function combineActions<N = HTMLElement, P = any>(
  actions: Action<N, P>[]
) {
  return (node: N, params?: P) => {
    let actionReturns: ReturnType<Action<N, P>>[] = [];
    actions.forEach((func) => {
      actionReturns.push(func(node, params));
    });
    return {
      update: (p) => {
        actionReturns.forEach((action) => {
          !!action && !!action?.update && action.update(p);
        });
      },
      destroy: () => {
        actionReturns.forEach((action) => {
          !!action && !!action?.destroy && action.destroy();
        });
      },
    } as ActionReturn<P>;
  };
}

/**
 * @see https://github.com/sveltejs/svelte/pull/7121
 * @see https://github.com/sveltejs/svelte/issues/6538
 */
export interface ActionReturn<Parameter = any> {
  update: (parameter: Parameter) => void;
  destroy?: () => void;
}

/**
 * @see https://github.com/sveltejs/svelte/pull/7121
 * @see https://github.com/sveltejs/svelte/issues/6538
 */
export interface Action<Element = HTMLElement, Parameter = any> {
  <Node extends Element>(
    node: Node,
    parameter?: Parameter
  ): void | ActionReturn<Parameter>;
}
