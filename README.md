# Svelte Shadow

A library of tools that allow you to build totally-custom and accessible accordions, dialogs, modals, tooltips, and more in Svelte. Written exclusively in Typescript with documentation.

```html
<script lang="ts">
  let [dialog1$, dialog1] = useDisclosure();
  let [tooltip$, tooltip] = useTooltip();
</script>

{#if $dialog1$.isOpen}
<dialog open use:dialog1.content="{$dialog1$}">here is some content!</dialog>
{/if}
<button use:dialog1.button="{$dialog1$}" on:click="{dialog1.toggle}">
  click to open modal
</button>
<a href="#" use:dialog1.button="{$dialog1$}" on:click="{dialog1.toggle}"
  >this link will also open dialog1</a
>

{#if $tooltip$.isOpen}
<dialog open use:tooltip.content="{$tooltip$}">here is the tip</dialog>
{/if}
<span use:tooltip.trigger="{$tooltip$}">hover for info</span>
```

## Install

Add it to your Svelte / Svelte Kit project:

`npm install git+https://github.com/syfrtech/svelte-shadow.git `

Note: this version is: 0.0.1-alpha.8
(alpha/beta releases may have breaking changes without warning)

## Why headless / unstyled?

This allows you to get the functionality you want without being constrained to a particular design style. You can use Material UI, Bootstrap, Carbon, Tailwind, or plain-ole CSS if you like.

## Why no .svelte files?

This library is specifically designed not to constrain you to any particular implementation, so it doesn't rely on Svelte components directly. Instead, it uses `use:actions`, providing tools so that you can quickly build functionality.

## What about accessibility?

This library is intended to fulfill accessibility / a11y without the headache and documented with references. Even if you think you don't want/need accessibility, you still probably want it. For example:

1. Accessible content is easier for machine processing: that means better SEO, better automation, better device compatibility, etc
2. Your interface is keyboard friendly🎉. This makes your application more appealing to advanced users who are annoyed when having to drag their mouse all over a screen for no reason.
3. You get thoroughly vetted patterns: no need to reinvent the wheel.
4. You avoid wasting time with naming and inconsistencies (ex: no need to debate `class="modal" id="modal1"` vs `class="modal1"`)
5. Your application is accessible to those with impairments.

See also:

- [Accessible Rich Internet Applications (WAI-ARIA) 1.2][wai-aria-1.2]
- [WAI-ARIA Authoring Practices 1.2][wai-aria-1.2-practices]

[wai-aria-1.2]: https://www.w3.org/TR/wai-aria-1.2/
[wai-aria-1.2-practices]: https://www.w3.org/TR/wai-aria-practices/
