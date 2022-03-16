import { derived, get } from "svelte/store";
import { useDisclosure } from "./disclosure";
import { escapeToDismissAction, useAriaRoleAction } from "./specAria";
import type { IsOpenIO } from "./specHtml";
import { combineActionsMap } from "./utils";

/**
 * @see escapeToDismissAction
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-7
 */
const useTriggerActions = (
  inheritedActions: ReturnType<typeof useDisclosure>[1]["actions"]["trigger"]
) => {
  return {
    ...inheritedActions,
    escapeToDismissAction,
    triggerAction: hoverOrFocusTriggerAction, //overwrite inherited
  };
};

/**
 * Uses "tooltip" role [per ARIA](https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-24).
 *
 * @see escapeToDismissAction
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-7
 */
const useContentActions = (
  inheritedActions: ReturnType<typeof useDisclosure>[1]["actions"]["content"]
) => {
  return {
    ...inheritedActions,
    escapeToDismissAction,
    ariaRoleAction: useAriaRoleAction("tooltip"),
  };
};

/**
 * Toggles the open state from hover/focus
 * # Note
 * Per [WCAG 2.1.1](https://www.w3.org/TR/WCAG21/#keyboard), function should not be dependent on a mouse, so we also include focus and blur
 *
 * @todo maybe toggle is determined according to whether keyboard or mouse triggered the event.  @see https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-23
 */
export const hoverOrFocusTriggerAction = (
  node: HTMLElement,
  params: IsOpenIO
) => {
  const update = (params: IsOpenIO) => {
    //trigger show
    node.onmouseenter = params.show;
    node.ontouchstart = params.show;
    node.onfocus = params.show;

    //trigger hide
    node.onmouseleave = params.close;
    node.ontouchend = params.close;
    node.onblur = params.close;
  };
  update(params);
  return { update };
};

/**
 * @param props.defaultOpen if supplied `true`, the tooltip will be visible on initialization
 * 
# Tooltip
A tooltip shows content on hover/focus 

[See ARIA "Tooltip" pattern](https://www.w3.org/TR/wai-aria-practices/#tooltip)
*/
export const useTooltip = (params?: Parameters<typeof useDisclosure>[0]) => {
  let [disclosure$] = useDisclosure(params);
  let { use, actions, ...disclosure } = get(disclosure$);
  let triggerActions = useTriggerActions(actions.trigger);
  let contentActions = useContentActions(actions.content);
  /**
   * @todo DRY up this code.
   * using a function tends to lose explicit properties (no mapped tuples)
   * @see https://github.com/microsoft/TypeScript/issues/29841
   */
  let result = {
    ...disclosure,
    use: {
      trigger: combineActionsMap(triggerActions),
      content: combineActionsMap(useContentActions(actions.content)),
    },
    actions: {
      trigger: triggerActions,
      content: contentActions,
    },
  };
  let result$ = derived(disclosure.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
