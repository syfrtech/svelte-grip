import { derived, get } from "svelte/store";
import { useDisclosure } from "./disclosure";
import { ariaExpandedAction, useAriaRoleAction } from "./specAria";
import type { htmlOpenState } from "./specHtml";
import { combineActions } from "./utils";

/**
 * Toggles the open state from hover/focus
 * # Note
 * Per [WCAG 2.1.1](https://www.w3.org/TR/WCAG21/#keyboard), function should not be dependent on a mouse, so we also include focus and blur
 *
 * @todo maybe toggle is determined according to whether keyboard or mouse triggered the event.  @see https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-23
 */
export const hoverOrFocusOpenAction = (
  node: HTMLElement,
  params: ReturnType<typeof htmlOpenState>
) => {
  const update = (params: ReturnType<typeof htmlOpenState>) => {
    //trigger show
    node.onmouseenter = params.show;
    node.ontouchstart = params.show;
    node.onfocus = params.show;

    //trigger hide
    node.onmouseleave = params.hide;
    node.ontouchend = params.hide;
    node.onblur = params.hide;
  };
  update(params);
  return { update };
};

/**
 * `Escape` key dismisses the Tooltip
 * @see https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-23
 *
 * This works when triggered through a focus.
 *
 * However, it should dismiss regardless of invocation from hover or focus
 * @see https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus
 *
 * Unfortunately, there is no consensus on how to accomplish this.
 * @see https://github.com/w3c/aria-practices/issues/127
 * @see https://github.com/w3c/aria-practices/issues/128
 */
export const escapeToDismissAction = (
  node: HTMLElement,
  params: ReturnType<typeof htmlOpenState>
) => {
  const update = (params: ReturnType<typeof htmlOpenState>) => {
    node.onkeyup = (e) => {
      if (e.key === "Escape") {
        params.hide();
      }
    };
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

Uses "tooltip" role [per ARIA](https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-24).
*/
export const useTooltip = (params?: Parameters<typeof useDisclosure>[0]) => {
  let [disclosure$] = useDisclosure(params);
  let { trigger, content, ...disclosure } = get(disclosure$);
  let result = {
    ...disclosure,
    content: combineActions([content, useAriaRoleAction("tooltip")]),
    trigger: combineActions([
      trigger,
      hoverOrFocusOpenAction,
      escapeToDismissAction,
    ]),
  };
  let result$ = derived(disclosure.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
