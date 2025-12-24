<script lang="ts" generics="T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>">
  import type { Id, OptionalSchemas, Store, Indexes } from "tinybase/with-schemas";
  import type { TableIdFromSchema } from "../types.js";
  import { sliceIds } from "../hooks-advanced.svelte.js";
  import SliceView from "./SliceView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    indexes: Indexes<T>;
    indexId: Id;
    store: Store<T>;
    tableId: TableId;
    debugIds?: boolean;
    separator?: string;
    sliceComponent?: typeof SliceView<T, TableId>;
    children?: Snippet<[sliceId: Id, indexes: Indexes<T>, indexId: Id, store: Store<T>, tableId: TableId]>;
  }

  const {
    indexes,
    indexId,
    store,
    tableId,
    debugIds = false,
    separator = "",
    sliceComponent,
    children,
  }: Props = $props();

  const sliceIdList = sliceIds(indexes, indexId);

  const SliceComponent = sliceComponent ?? SliceView;
</script>

{#snippet content()}
  {#each sliceIdList as sliceId, i (sliceId)}
    {#if i > 0 && separator}{separator}{/if}
    {#if children}
      {@render children(sliceId, indexes, indexId, store, tableId)}
    {:else}
      <SliceComponent {indexes} {indexId} {sliceId} {store} {tableId} {debugIds} />
    {/if}
  {/each}
{/snippet}

{#if debugIds}
  <span data-index-id={indexId}>
    {@render content()}
  </span>
{:else}
  {@render content()}
{/if}
