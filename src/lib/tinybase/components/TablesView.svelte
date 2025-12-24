<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Store } from "tinybase/with-schemas";
  import type { TableIdFromSchema } from "../types.js";
  import { tableIds } from "../hooks.svelte.js";
  import TableView from "./TableView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    debugIds?: boolean;
    separator?: string;
    tableComponent?: typeof TableView<T, TableIdFromSchema<T[0]>>;
    children?: Snippet<[tableId: TableIdFromSchema<T[0]>, store: Store<T>]>;
  }

  const {
    store,
    debugIds = false,
    separator = "",
    tableComponent,
    children,
  }: Props = $props();

  const tableIdList = tableIds(store);

  const TableComponent = tableComponent ?? TableView;
</script>

{#each tableIdList as tableId, i (tableId)}
  {#if i > 0 && separator}{separator}{/if}
  {#if children}
    {@render children(tableId as TableIdFromSchema<T[0]>, store)}
  {:else}
    <TableComponent {store} {tableId} {debugIds} />
  {/if}
{/each}

