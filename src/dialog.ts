import { derived, get } from "svelte/store";
import { useDisclosure } from "./disclosure";
import { useAriaRoleAction } from "./specAria";
import { combineActions } from "./utils";

/**
 * @param props.defaultOpen if supplied `true`, the dialog will be visible on initialization
 * 
# Dialog / Model
A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert.

[See ARIA "Dialog" pattern](https://www.w3.org/TR/wai-aria-practices/#dialog_modal)

Uses "dialog" role [per ARIA](https://www.w3.org/TR/wai-aria-practices/#dialog_roles_states_props).
*/
export const useDialog = (params?: Parameters<typeof useDisclosure>[0]) => {
  let [disclosure$] = useDisclosure(params);
  let { trigger, content, ...disclosure } = get(disclosure$);
  let result = {
    ...disclosure,
    content: combineActions([content, useAriaRoleAction("dialog")]),
    trigger: combineActions([trigger]),
  };
  let result$ = derived(disclosure.isOpen$, (isOpen) => {
    return { ...result, isOpen };
  });
  return [result$, result] as const;
};
