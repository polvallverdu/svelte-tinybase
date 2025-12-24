<script lang="ts" generics="T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>">
  import type { Id, OptionalSchemas, Store, Relationships } from "tinybase/with-schemas";
  import type { TableIdFromSchema } from "../types.js";
  import { remoteRowId as remoteRowIdHook } from "../hooks-advanced.svelte.js";
  import RowView from "./RowView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    relationships: Relationships<T>;
    relationshipId: Id;
    localRowId: Id;
    store: Store<T>;
    tableId: TableId;
    debugIds?: boolean;
    rowComponent?: typeof RowView<T, TableId>;
    children?: Snippet<[rowId: Id | undefined, store: Store<T>, tableId: TableId]>;
  }

  const {
    relationships,
    relationshipId,
    localRowId,
    store,
    tableId,
    debugIds = false,
    rowComponent,
    children,
  }: Props = $props();

  const rowId = remoteRowIdHook(relationships, relationshipId, localRowId);

  const RowComponent = rowComponent ?? RowView;
</script>

{#snippet content()}
  {#if children}
    {@render children(rowId, store, tableId)}
  {:else if rowId !== undefined}
    <RowComponent {store} {tableId} {rowId} {debugIds} />
  {/if}
{/snippet}

{#if debugIds}
  <span data-relationship-id={relationshipId} data-local-row-id={localRowId}>
    {@render content()}
  </span>
{:else}
  {@render content()}
{/if}
