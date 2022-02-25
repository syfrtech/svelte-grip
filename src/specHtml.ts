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


 * @todo Typescript isn't allowing HTMLDialogElement. @see https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1259#issue-1121802821
 */

export const htmlOpenAttributeAction = (
  node: HTMLElement,
  params: ReturnType<typeof htmlOpenState>
) => {
  const update = (params: ReturnType<typeof htmlOpenState>) => {
    if (node instanceof HTMLDetailsElement) {
      node.open = get(params.isOpen$);
    }
  };
  update(params);
  return { update };
};

/**
 * A record which indicates visibility
 * @param defaultOpen if supplied `true`, the content will be visible on initialization
 */
export const htmlOpenStore = (defaultOpen: boolean = false) => {
  return writable(defaultOpen);
};

/**
 * Provides functions which change the visibility of the content
 */
export const htmlOpenMutators = (stores: {
  isOpen$: ReturnType<typeof htmlOpenStore>;
}) => {
  return {
    toggle: () => stores.isOpen$.update((cur) => !cur),
    show: () => stores.isOpen$.set(true),
    hide: () => stores.isOpen$.set(false),
  };
};

/**
 * Provides the visibility store and mutators
 */
export const htmlOpenState = (
  defaultOpen: Parameters<typeof htmlOpenStore>[0]
) => {
  let stores = { isOpen$: htmlOpenStore(defaultOpen) };
  let mutators = htmlOpenMutators(stores);
  return { ...stores, ...mutators };
};

export type HtmlOpenState = ReturnType<typeof htmlOpenState>;
