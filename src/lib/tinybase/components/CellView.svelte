<script lang="ts" generics="T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>, CellId extends CellIdFromSchema<T[0], TableId>">
  import type { Id, OptionalSchemas, Store } from "tinybase/with-schemas";
  import type { CellIdFromSchema, TableIdFromSchema } from "../types.js";
  import { cell } from "../hooks.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    tableId: TableId;
    rowId: Id;
    cellId: CellId;
    debugIds?: boolean;
    children?: Snippet<[cellValue: ReturnType<typeof cell<T, TableId, CellId>>]>;
  }

  const { store, tableId, rowId, cellId, debugIds = false, children }: Props = $props();

  const cellValue = cell(store, tableId, rowId, cellId);
</script>

{#if debugIds}
  <span data-table-id={tableId} data-row-id={rowId} data-cell-id={cellId}>
    {#if children}
      {@render children(cellValue)}
    {:else}
      {cellValue ?? ""}
    {/if}
  </span>
{:else if children}
  {@render children(cellValue)}
{:else}
  {cellValue ?? ""}
{/if}

