# Svelte Shadow

A library of tools that allow you to build totally-custom and accessible accordions, dialogs, modals, tooltips, and more in Svelte. Written exclusively in Typescript with documentation.

```html
<script lang="ts">
  let [dialog1$, dialog1] = useDisclosure();
  let [tooltip$, tooltip] = useTooltip();
</script>

<dialog open use:dialog1.content="{$dialog1$}">here is some content!</dialog>
<button use:dialog1.button="{$dialog1$}" on:click="{dialog1.toggle}">
  click to open modal
</button>
<a href="#" use:dialog1.button="{$dialog1$}" on:click="{dialog1.toggle}"
  >this link will also open dialog1</a
>

<dialog open use:tooltip.content="{$tooltip$}">here is the tip</dialog>
<span use:tooltip.trigger="{$tooltip$}">hover for info</span>
```

## Install

Add it to your Svelte / Svelte Kit project:

`npm install git+https://github.com/syfrtech/svelte-shadow.git `

Note: this version is: 0.0.1-alpha.8
(alpha/beta releases may have breaking changes without warning)

## How it works

1. You import an action you want to use. ex: `let [tooltip$, tooltip] = useTooltip();`
2. You add the action to the element(s) that will use that action. ex: `<span use:tooltip.trigger="{$tooltip$}">hover for info</span>`
3. The action injects the necessary functionality into your element. For example, the `span` above, would register the events to track mouseover and focus to toggle the tooltip content.

Note: reactive values have a `$` suffix to indicate their reactiveness (ex: `dialog1$`). You can subscribe to them with the `$` prefix, so they end up looking like `$dialog1$`

## Transitions / Animations

It's actually quite easy! Although may a11y patterns do not account for transition animations, we can add this behavior with Svelte. For example:

```html
{#if $dialog1$.isOpen}
<dialog
  transition:fade="{{delay: 250, duration: 300}}"
  open
  use:dialog1.content="{$dialog1$}"
>
  here is some content!
</dialog>
{/if}
```

The nice thing here is that svelte-shadow does not interfere with Svelte. You can customize styling and animation transitions however you like using native Svelte syntax... which boils down to native HTML + JS 🤩!

## FAQ

### Why headless / unstyled?

This allows you to get the functionality you want without being constrained to a particular design style. You can use Material UI, Bootstrap, Carbon, Tailwind, or plain-ole CSS if you like.

### Why no .svelte files?

This library is specifically itended to avoid straightjacketing you to any particular implementation; it doesn't rely on Svelte components directly. It can be tempting to create the functionality (like React), but we _resist the temptation_! Instead, we use `use:actions` to provide tool access. From there, you are welcome to extend your elements as Svelte components or additional actions as you see fit.

### What about accessibility?

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
