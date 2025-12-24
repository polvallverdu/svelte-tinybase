<script lang="ts" generics="T extends OptionalSchemas">
  import type { Id, OptionalSchemas, Queries } from "tinybase/with-schemas";
  import { resultRowIds } from "../hooks-advanced.svelte.js";
  import ResultRowView from "./ResultRowView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    queries: Queries<T>;
    queryId: Id;
    debugIds?: boolean;
    separator?: string;
    rowComponent?: typeof ResultRowView<T>;
    children?: Snippet<[rowId: Id, queries: Queries<T>, queryId: Id]>;
  }

  const {
    queries,
    queryId,
    debugIds = false,
    separator = "",
    rowComponent,
    children,
  }: Props = $props();

  const rowIdList = resultRowIds(queries, queryId);

  const RowComponent = rowComponent ?? ResultRowView;
</script>

{#snippet content()}
  {#each rowIdList as rowId, i (rowId)}
    {#if i > 0 && separator}{separator}{/if}
    {#if children}
      {@render children(rowId, queries, queryId)}
    {:else}
      <RowComponent {queries} {queryId} {rowId} {debugIds} />
    {/if}
  {/each}
{/snippet}

{#if debugIds}
  <span data-query-id={queryId}>
    {@render content()}
  </span>
{:else}
  {@render content()}
{/if}
