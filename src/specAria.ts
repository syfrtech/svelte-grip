import { get } from "svelte/store";
import type { HtmlOpenState } from "./specHtml";

/**
 * Indicates whether a grouping element owned or controlled by this element is expanded or collapsed. See spec on: [W3C](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded) or [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
 *
 * Used by:
 * - [disclosure pattern](https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-8)
 */
export const ariaExpandedAction = (
  node: HTMLElement,
  params: HtmlOpenState
) => {
  const update = ({ isOpen$ }: HtmlOpenState) => {
    node.ariaExpanded = get(isOpen$) ? "true" : "false";
  };
  update(params);
  return { update };
};

/**
 * Sets the [WAI ARIA HTML `role` attribute](https://www.w3.org/TR/wai-aria-1.2/#introroles) using the following priority:
 * 1. The role defined on the element, ex: `<div role="button" ...`
 * 2. The role included in the params, ex: `{role:"button",...}`
 * 3. Otherwise, remains undefined
 *
 * Example button docs on [W3C](https://www.w3.org/TR/wai-aria-1.2/#button) and [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)
 *
 *
 * @todo use [explicit roles list](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/58d7d1a31a96eb4a808a29ce20ac3bd450f83e20/types/react/index.d.ts#L1742). see also [svelte issue #820](https://github.com/sveltejs/svelte/issues/820).
 *
 * @todo disable redundant roles
 *
 * In the majority of cases setting an ARIA role and/or aria-* attribute that matches the default implicit ARIA semantics is unnecessary and [not recommended](https://www.w3.org/TR/using-aria/#aria-does-nothing) as these properties are already set by the browser.
 */
export const useAriaRoleAction = (role: string) => {
  return (node: HTMLElement) => {
    node.setAttribute("role", role);
  };
};
