import { derived, get } from "svelte/store";
import { useDisclosure } from "./disclosure";
import {
  escapeToDismissAction,
  ariaModalAction,
  ariaExpandedAction,
  useAriaRoleAction,
} from "./specAria";
import { useTriggerAction, openAttributeAction } from "./specHtml";
import { combineActionsMap } from "./utils";

export const dialogTriggerOpen = {
  ariaExpandedAction,
  triggerAction: useTriggerAction({
    action: "open",
    triggerFromChildren: true,
  }),
};

/**
 * It is strongly recommended that the tab sequence of all dialogs include a visible element with role button that closes the dialog, such as a close icon or cancel button.
 * [see note 3](https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-7)
 */
export const dialogTriggerClose = {
  openAttributeAction,
  triggerAction: useTriggerAction({
    action: "close",
    triggerFromChildren: true,
  }),
};

/**
 * Uses "dialog" role [per ARIA](https://www.w3.org/TR/wai-aria-1.2/#dialog) and [ARIA Practices](https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_roles_states_props).
 *
 * @see escapeToDismissAction
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-7
 */
export const dialogContent = {
  ariaRoleAction: useAriaRoleAction("dialog"),
  escapeToDismissAction,
  ariaModalAction,
  openAttributeAction,
};

export const dialogBackdrop = {
  triggerAction: useTriggerAction({
    action: "close",
    triggerFromChildren: false,
  }),
  escapeToDismissAction,
};

/**
 * @param props.defaultOpen if supplied `true`, the dialog will be visible on initialization
 * 
# Dialog / Model
A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert.

[See ARIA "Dialog" pattern](https://www.w3.org/TR/wai-aria-practices/#dialog_modal)
*/
export const useDialog = (params?: Parameters<typeof useDisclosure>[0]) => {
  let [disclosure$] = useDisclosure(params);
  let { trigger, content, ...disclosure } = get(disclosure$);
  /**
   * @todo DRY up this code.
   * using a function tends to lose explicit properties (no mapped tuples)
   * @see https://github.com/microsoft/TypeScript/issues/29841
   */
  let result = {
    ...disclosure,
    triggerOpen: combineActionsMap(dialogTriggerOpen),
    triggerClose: combineActionsMap(dialogTriggerClose),
    content: combineActionsMap(dialogContent),
    backdrop: combineActionsMap(dialogBackdrop),
  };
  let result$ = derived(disclosure.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
