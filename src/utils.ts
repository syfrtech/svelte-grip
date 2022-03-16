/**
 * Combines a map of actions into a single action.
 * @note The actions must be able to receive the same params
 */
export function combineActionsMap<N = HTMLElement, P = any>(
  actionsMap: ActionsMap<N, P>
) {
  return (node: N, params?: P) => {
    let actionReturns: ReturnType<Action<N, P>>[] = [];
    for (const item in actionsMap) {
      actionReturns.push(actionsMap[item](node, params));
    }
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

export interface ActionsMap<N = HTMLElement, P = any> {
  [action: string]: Action<N, P>;
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
 * @note Action type doesn't exist; so we implement our own below
 * @see https://github.com/sveltejs/svelte/pull/7121
 * @see https://github.com/sveltejs/svelte/issues/6538
 */
export interface Action<Element = HTMLElement, Parameter = any> {
  <Node extends Element>(
    node: Node,
    parameter?: Parameter
  ): void | ActionReturn<Parameter>;
}
