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

export const openAttributeAction = (
  node: HTMLElement & { open?: boolean },
  store: IsOpenStore
) => {
  const update = (store: IsOpenStore) => {
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
