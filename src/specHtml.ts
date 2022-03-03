import { get, writable } from "svelte/store";

//https://github.com/romkor/svelte-portal/blob/master/src/Portal.svelte

/**
 * `open` attribute (ex: `<dialog open...`) indicates whether an element's contents are visible. It is available on certain elements:
 * - [dialog]( https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#attributes)
 * - [details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#attributes)
 * 
 * [MDN list of all attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
 * 
## Note
This differs from CSS [visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility) and [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) which are intended for styling; not necessarily state.

[Some typescript implementations ignore HTMLDialogElement](https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1259#issue-1121802821) as of February 2022. Instead, we just check if the passed element contains the "open" property.
 */

export const htmlOpenAttributeAction = (
  node: HTMLElement & { open?: boolean },
  store: ReturnType<typeof htmlOpenStore>
) => {
  const update = (store: ReturnType<typeof htmlOpenStore>) => {
    if ("open" in node) {
      node.open = get(store.isOpen$);
    }
  };
  update(store);
  return { update };
};

/**
 * A record which indicates visibility
 * @param defaultOpen if supplied `true`, the content will be visible on initialization
 */
export const htmlOpenStore = (defaultOpen: boolean = false) => {
  return { isOpen$: writable(defaultOpen) };
};

/**
 * Provides functions which change the visibility of the content
 */
export const htmlOpenMutators = (store: ReturnType<typeof htmlOpenStore>) => {
  return {
    toggle: () => store.isOpen$.update((cur) => !cur),
    show: () => store.isOpen$.set(true),
    hide: () => store.isOpen$.set(false),
  };
};

/**
 * Provides the visibility store and mutators
 */
export const htmlOpenState = (
  defaultOpen: Parameters<typeof htmlOpenStore>[0]
) => {
  let store = htmlOpenStore(defaultOpen);
  let mutators = htmlOpenMutators(store);
  return { ...store, ...mutators };
};

export type HtmlOpenState = ReturnType<typeof htmlOpenState>;
