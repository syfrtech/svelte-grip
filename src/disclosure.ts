import { derived } from "svelte/store";
import { ariaExpandedAction } from "./specAria";
import { openAttributeAction, isOpenIO, useTriggerAction } from "./specHtml";
import { combineActionsMap } from "./utils";

/**
 * @see ariaExpandedAction
 * @see https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-8
 */
const triggerActions = {
  ariaExpandedAction,
  triggerAction: useTriggerAction({
    action: "toggle",
    triggerFromChildren: true,
  }),
};

/**
 * @see openAttributeAction
 * @see https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-8
 */
const contentActions = { openAttributeAction };

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
- `use:` is needed to apply functionality, but cannot use reactives values here.  ex: `use:$dialog1$.triggerAction` fails
- [It is recommended](https://github.com/sveltejs/svelte/issues/6373) to add a `$` suffix to reactive variable names to have a simple indicator to distinguish them from non-reactive values. ex: `[$disclosure, disclosure] = useDisclosure();`
*/
export const useDisclosure = (params?: {
  defaultOpen: Parameters<typeof isOpenIO>[0];
}) => {
  let io = isOpenIO(params?.defaultOpen);

  /**
   * @todo DRY up this code.
   * using a function tends to lose explicit properties (no mapped tuples)
   * @see https://github.com/microsoft/TypeScript/issues/29841
   */
  let result = {
    ...io,
    use: {
      trigger: combineActionsMap(triggerActions),
      content: combineActionsMap(contentActions),
    },
    actions: {
      trigger: triggerActions,
      content: contentActions,
    },
  };
  let result$ = derived(io.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
