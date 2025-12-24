<script lang="ts" generics="T extends OptionalSchemas">
  import type { Id, OptionalSchemas, Queries } from "tinybase/with-schemas";
  import { resultCellIds } from "../hooks-advanced.svelte.js";
  import ResultCellView from "./ResultCellView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    queries: Queries<T>;
    queryId: Id;
    rowId: Id;
    debugIds?: boolean;
    separator?: string;
    cellComponent?: typeof ResultCellView<T>;
    children?: Snippet<[cellId: Id, queries: Queries<T>, queryId: Id, rowId: Id]>;
  }

  const {
    queries,
    queryId,
    rowId,
    debugIds = false,
    separator = "",
    cellComponent,
    children,
  }: Props = $props();

  const cellIdList = resultCellIds(queries, queryId, rowId);

  const CellComponent = cellComponent ?? ResultCellView;
</script>

{#snippet content()}
  {#each cellIdList as cellId, i (cellId)}
    {#if i > 0 && separator}{separator}{/if}
    {#if children}
      {@render children(cellId, queries, queryId, rowId)}
    {:else}
      <CellComponent {queries} {queryId} {rowId} {cellId} {debugIds} />
    {/if}
  {/each}
{/snippet}

{#if debugIds}
  <span data-query-id={queryId} data-row-id={rowId}>
    {@render content()}
  </span>
{:else}
  {@render content()}
{/if}
