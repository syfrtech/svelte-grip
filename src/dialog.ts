import { derived, get } from "svelte/store";
import { useDisclosure } from "./disclosure";
import {
  escapeToDismissAction,
  ariaModalAction,
  useAriaRoleAction,
} from "./specAria";
import { combineActions } from "./utils";

/**
 * @see escapeToDismissAction
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-7
 */
const triggerAction = combineActions([escapeToDismissAction]);

/**
 * Uses "dialog" role [per ARIA](https://www.w3.org/TR/wai-aria-1.2/#dialog) and [ARIA Practices](https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_roles_states_props).
 *
 * @see escapeToDismissAction
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-7
 */
const contentAction = combineActions([
  escapeToDismissAction,
  useAriaRoleAction("dialog"),
  ariaModalAction,
]);

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
  let result = {
    ...disclosure,
    content: combineActions([content, contentAction]),
    trigger: combineActions([trigger, triggerAction]),
  };
  let result$ = derived(disclosure.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
