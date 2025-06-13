import type { Id, OptionalSchemas, Row, Store } from "tinybase/with-schemas";
import type { TableIdFromSchema } from "../types.js";
import { readable, type Writable } from "svelte/store";

/**
 * Creates a reactive hook for accessing a specific row in a TinyBase table.
 * The returned object provides a reactive proxy to the row data that
 * automatically updates when the underlying store changes.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table containing the row
 * @param rowId - The ID of the row to create a hook for
 * @returns An object with a reactive value property that provides access to the row
 */
export function useRow<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  store: Store<T>,
  tableId: TableId,
  rowId: Id,
) {
  const createValue = () => store.getRow(tableId, rowId);

  const { subscribe } = readable(createValue(), (set) => {
    const listener = store.addRowListener(tableId, rowId, () => {
      set(createValue());
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: Row<T[0], TableId, false>) {
      store.setRow(tableId, rowId, value);
    },
    update(updater: (value: Row<T[0], TableId, false>) => Row<T[0], TableId, false>) {
      store.setRow(tableId, rowId, updater(store.getRow(tableId, rowId)));
    },
  } satisfies Writable<Row<T[0], TableId, false>>;
}
