import { get, writable } from "svelte/store";

//https://github.com/romkor/svelte-portal/blob/master/src/Portal.svelte

/**
 * `open` attribute (ex: `<dialog open...`) indicates whether an element's contents are visible. It is only available on these elements:
 * 1. [dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-open)
 * 2. [details](https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-open)
 * 
 * see also: ["open" in the MDN list of all attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
 * 
## Note
This differs from CSS [visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility) and [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) which are intended for styling; not necessarily state.

[Some typescript implementations don't include HTMLDialogElement](https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1259#issue-1121802821) as of February 2022. Instead, we just check if the passed element contains the "open" property.
 * 
 */

export const openAttributeAction = (
  node: HTMLElement & { open?: boolean },
  store: IsOpenStore
) => {
  const update = (store: IsOpenStore) => {
    node.open = get(store.isOpen$);
  };
  update(store);
  return { update };
};

/**
 * open or close the content when the element is triggered
 * element is triggered by a mouse click, or keyboard space / enter key
 *
 * onclick (when used on a button) is also triggred by space / enter on keyboard
 * @see https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-3
 *
 * action:
 *  - "open" will expand the content on triger
 *  - "close" will collapse the content on trigger
 *  - "toggle" will switch between closed or opened
 *
 * triggerFromChildren:
 *  - true will dismiss when the element or children are triggered
 *  - false will dismiss only when the exact element is triggered
 */
export const useTriggerAction = ({
  action,
  triggerFromChildren,
  callback,
}: {
  action: "open" | "close" | "toggle";
  triggerFromChildren: boolean;
  callback?: (params: IsOpenStore) => void;
}) => {
  return (node: HTMLElement, params: IsOpenStore) => {
    const trigger = (e) => {
      if (triggerFromChildren || e.target === node) {
        action === "open" && params.isOpen$.set(false);
        action === "close" && params.isOpen$.set(false);
        action === "toggle" && params.isOpen$.update((isOpen) => !isOpen);
        !!callback && callback(params);
      }
    };
    const update = (params: IsOpenStore) => {
      node.onclick = (e) => {
        trigger(e);
      };
      if (!(node instanceof HTMLButtonElement)) {
        node.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            trigger(e);
          }
        };
      }
    };
    update(params);
    return { update };
  };
};

/**
 * Spec suggests using native functions [`show`](https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-show) and [`close`](https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-close) to open/close a dialog.
 *
 * This avoids the following potential problems:
 * if we simply remove the open attribute:
 * 1. The close event will not be fired.
 * 2. The close() method, and any user-agent provided cancelation interface, will no longer be able to close the dialog.
 * 3. If the dialog was shown using its showModal() method, the Document will still be blocked.
 *
 * However these issues are largely moot with regard to Svelte.
 *
 * Disclosure sets the attribute directly using @see openAttributeAction however the order may not be correct.
 *
 * # @todo dialog.showModal()
 * - Displays the dialog element and makes it the top-most modal dialog.
 * - This method honors the autofocus attribute.
 */
// export const openAttributeDialogAction = (
//   node: HTMLElement & { open?: boolean; show?: () => void; close?: () => void },
//   store: IsOpenStore
// ) => {
//   const update = (store: IsOpenStore) => {
//     let isOpen = get(store.isOpen$);
//     isOpen && "show" in node && node.show();
//     !isOpen && "close" in node && node.close();
//   };
//   update(store);
//   return { update };
// };

/**
 * A record which indicates visibility
 * @param defaultOpen if supplied `true`, the content will be visible on initialization
 */
export const isOpenStore = (defaultOpen: boolean = false) => {
  return { isOpen$: writable(defaultOpen) };
};
export type IsOpenStore = ReturnType<typeof isOpenStore>;

/**
 * Provides functions which change the visibility of the content
 */
export const isOpenMutators = (store: IsOpenStore) => {
  return {
    toggle: () => store.isOpen$.update((cur) => !cur),
    show: () => store.isOpen$.set(true),
    close: () => store.isOpen$.set(false),
  };
};

/**
 * Provides the visibility store and mutators
 */
export const isOpenIO = (defaultOpen: Parameters<typeof isOpenStore>[0]) => {
  let store = isOpenStore(defaultOpen);
  let mutators = isOpenMutators(store);
  return { ...store, ...mutators };
};

export type IsOpenIO = ReturnType<typeof isOpenIO>;
