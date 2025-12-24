<script lang="ts" generics="T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>">
  import type { Id, OptionalSchemas, Store } from "tinybase/with-schemas";
  import type { CellIdFromSchema, TableIdFromSchema } from "../types.js";
  import { cellIds } from "../hooks.svelte.js";
  import CellView from "./CellView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    tableId: TableId;
    rowId: Id;
    debugIds?: boolean;
    separator?: string;
    cellComponent?: typeof CellView<T, TableId, CellIdFromSchema<T[0], TableId>>;
    children?: Snippet<
      [cellId: CellIdFromSchema<T[0], TableId>, store: Store<T>, tableId: TableId, rowId: Id]
    >;
  }

  const {
    store,
    tableId,
    rowId,
    debugIds = false,
    separator = "",
    cellComponent,
    children,
  }: Props = $props();

  const cellIdList = cellIds(tableId, rowId, store);

  const CellComponent = cellComponent ?? CellView;
</script>

{#snippet content()}
  {#each cellIdList as cellId, i (cellId)}
    {#if i > 0 && separator}{separator}{/if}
    {#if children}
      {@render children(cellId as CellIdFromSchema<T[0], TableId>, store, tableId, rowId)}
    {:else}
      <CellComponent {store} {tableId} {rowId} {cellId} {debugIds} />
    {/if}
  {/each}
{/snippet}

{#if debugIds}
  <span data-table-id={tableId} data-row-id={rowId}>
    {@render content()}
  </span>
{:else}
  {@render content()}
{/if}
