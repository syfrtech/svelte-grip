import { derived } from "svelte/store";
import { ariaExpandedAction } from "./specAria";
import { htmlOpenAttributeAction, htmlOpenState } from "./specHtml";
import { deriveAction } from "./utils";

/**
 * @see ariaExpandedAction
 * @see https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-8
 */
const buttonAction = deriveAction([ariaExpandedAction]);

/**
 * @see htmlOpenElementAction
 * @see https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-8
 */
const contentAction = deriveAction([htmlOpenAttributeAction]);

const dialogActions = { button: buttonAction, content: contentAction };

/**
 * @param props.defaultOpen if supplied `true`, the disclosure will be visible on initialization
 * 
# Disclosure
(a.k.a.: Dialog, Modal, Accordion)

  A disclosure enables content to be either collapsed (hidden) or expanded (visible). It has two elements: 
  1. a disclosure button
  2. a section of content whose visibility is controlled by the button.

[See ARIA "Disclosure" pattern](https://www.w3.org/TR/wai-aria-practices/#disclosure)

## Note
returns `[Readable<ob>, obj]` so that consumers can have access to reactive (ex: $disclosure$.isOpen) or static properties (ex: disclosure.toggle) for easier use with Svelte:
- {#if ...} is useful for transitions, but cannot use $ on properties.ex: `dialog1.$isOpen` or `$dialog1.isOpen` fails
- `use:` is needed to apply functionality, but cannot use reactives values here.  ex: `use:$dialog1$.buttonAction` fails
- [It is recommended](https://github.com/sveltejs/svelte/issues/6373) to add a `$` suffix to reactive variable names to have a simple indicator to distinguish them from non-reactive values. ex: `[$disclosure, disclosure] = useDisclosure();`
*/
export const useDisclosure = (params?: {
  defaultOpen: Parameters<typeof htmlOpenState>[0];
}) => {
  let state = htmlOpenState(params?.defaultOpen);
  let result = { ...state, ...dialogActions };
  let result$ = derived(state.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
