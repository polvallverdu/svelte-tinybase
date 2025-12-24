<script lang="ts" generics="T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>">
  import type { Id, OptionalSchemas, Store, Indexes } from "tinybase/with-schemas";
  import type { TableIdFromSchema } from "../types.js";
  import { sliceRowIds } from "../hooks-advanced.svelte.js";
  import RowView from "./RowView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    indexes: Indexes<T>;
    indexId: Id;
    sliceId: Id;
    store: Store<T>;
    tableId: TableId;
    debugIds?: boolean;
    separator?: string;
    rowComponent?: typeof RowView<T, TableId>;
    children?: Snippet<[rowId: Id, store: Store<T>, tableId: TableId]>;
  }

  const {
    indexes,
    indexId,
    sliceId,
    store,
    tableId,
    debugIds = false,
    separator = "",
    rowComponent,
    children,
  }: Props = $props();

  const rowIdList = sliceRowIds(indexes, indexId, sliceId);

  const RowComponent = rowComponent ?? RowView;
</script>

{#snippet row()}
  {#each rowIdList as rowId, i (rowId)}
    {#if i > 0 && separator}{separator}{/if}
    {#if children}
      {@render children(rowId, store, tableId)}
    {:else}
      <RowComponent {store} {tableId} {rowId} {debugIds} />
    {/if}
  {/each}
{/snippet}

{#if debugIds}
  <span data-index-id={indexId} data-slice-id={sliceId}>
    {@render row()}
  </span>
{:else}
  {@render row()}
{/if}
