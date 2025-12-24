<script lang="ts" generics="T extends OptionalSchemas, ValueId extends ValueIdFromSchema<T>">
  import type { OptionalSchemas, Store } from "tinybase/with-schemas";
  import type { ValueIdFromSchema } from "../types.js";
  import { value } from "../hooks.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    valueId: ValueId;
    debugIds?: boolean;
    children?: Snippet<[valueData: ReturnType<typeof value<T, ValueId>>]>;
  }

  const { store, valueId, debugIds = false, children }: Props = $props();

  const valueData = value(store, valueId);
</script>

{#if debugIds}
  <span data-value-id={valueId}>
    {#if children}
      {@render children(valueData)}
    {:else}
      {valueData ?? ""}
    {/if}
  </span>
{:else if children}
  {@render children(valueData)}
{:else}
  {valueData ?? ""}
{/if}

