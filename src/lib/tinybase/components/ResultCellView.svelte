<script lang="ts" generics="T extends OptionalSchemas">
  import type { Id, OptionalSchemas, Queries } from "tinybase/with-schemas";
  import { resultCell } from "../hooks-advanced.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    queries: Queries<T>;
    queryId: Id;
    rowId: Id;
    cellId: Id;
    debugIds?: boolean;
    children?: Snippet<[cellValue: ReturnType<typeof resultCell<T>>]>;
  }

  const { queries, queryId, rowId, cellId, debugIds = false, children }: Props = $props();

  const cellValue = resultCell(queries, queryId, rowId, cellId);
</script>

{#if debugIds}
  <span data-query-id={queryId} data-row-id={rowId} data-cell-id={cellId}>
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

