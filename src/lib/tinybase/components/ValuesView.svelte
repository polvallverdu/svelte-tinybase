<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Store } from "tinybase/with-schemas";
  import type { ValueIdFromSchema } from "../types.js";
  import { valueIds } from "../hooks.svelte.js";
  import ValueView from "./ValueView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    debugIds?: boolean;
    separator?: string;
    valueComponent?: typeof ValueView<T, ValueIdFromSchema<T>>;
    children?: Snippet<[valueId: ValueIdFromSchema<T>, store: Store<T>]>;
  }

  const {
    store,
    debugIds = false,
    separator = "",
    valueComponent,
    children,
  }: Props = $props();

  const valueIdList = valueIds(store);

  const ValueComponent = valueComponent ?? ValueView;
</script>

{#each valueIdList as valueId, i (valueId)}
  {#if i > 0 && separator}{separator}{/if}
  {#if children}
    {@render children(valueId as ValueIdFromSchema<T>, store)}
  {:else}
    <ValueComponent {store} {valueId} {debugIds} />
  {/if}
{/each}

