<script lang="ts" generics="T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>">
  import type { Id, OptionalSchemas, Store } from "tinybase/with-schemas";
  import type { TableIdFromSchema } from "../types.js";
  import { rowIds } from "../hooks.svelte.js";
  import RowView from "./RowView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    tableId: TableId;
    debugIds?: boolean;
    separator?: string;
    rowComponent?: typeof RowView<T, TableId>;
    children?: Snippet<[rowId: Id, store: Store<T>, tableId: TableId]>;
  }

  const {
    store,
    tableId,
    debugIds = false,
    separator = "",
    rowComponent,
    children,
  }: Props = $props();

  const rowIdList = rowIds(tableId, store);

  const RowComponent = rowComponent ?? RowView;
</script>

{#snippet content()}
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
  <span data-table-id={tableId}>
    {@render content()}
  </span>
{:else}
  {@render content()}
{/if}
