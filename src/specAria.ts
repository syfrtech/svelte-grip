import { get } from "svelte/store";
import type { IsOpenStore } from "./specHtml";

/**
 * `Escape` key dismisses the disclosure
 * @see https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-23
 *
 * It should dismiss when triggered by a hover
 * @see https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus
 *
 * Unfortunately, there is no consensus on how to accomplish this.
 * @see https://github.com/w3c/aria-practices/issues/127
 * @see https://github.com/w3c/aria-practices/issues/128
 */
export const escapeToDismissAction = (
  node: HTMLElement,
  params: IsOpenStore
) => {
  const update = (params: IsOpenStore) => {
    node.onkeyup = (e) => {
      if (e.key === "Escape") {
        params.isOpen$.set(false);
      }
    };
  };
  update(params);
  return { update };
};

/**
 * Indicates whether a grouping element owned or controlled by this element is expanded or collapsed. See spec on: [W3C](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded) or [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
 *
 * Used by:
 * - [disclosure pattern](https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-8)
 */
export const ariaExpandedAction = (node: HTMLElement, params: IsOpenStore) => {
  const update = ({ isOpen$ }: IsOpenStore) => {
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

/**
 * The [aria-modal attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-modal) is used to indicate that the presence of a "modal" element precludes usage of other content on the page.
 *
 * Add to dialog content per [ARIA Practices](https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_roles_states_props)
 */
export const ariaModalAction = (node: HTMLElement) => {
  node.setAttribute("aria-modal", "true");
};
