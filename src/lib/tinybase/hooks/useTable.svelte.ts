import type { OptionalSchemas, Store } from "tinybase/with-schemas";
import type { TableIdFromSchema } from "../types.js";
import { readable, type Writable } from "svelte/store";

/**
 * Creates a reactive hook for accessing a TinyBase table.
 * The returned object provides a reactive proxy to the table data that
 * automatically updates when the underlying store changes.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table to create a hook for
 * @returns An object with a reactive value property that provides access to the table
 */
export function useTable<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  store: Store<T>,
  tableId: TableId,
) {
  const createValue = () => store.getTable(tableId);

  type Value = ReturnType<typeof createValue>;

  const { subscribe } = readable(createValue(), (set) => {
    const listener = store.addTableListener(tableId, () => {
      set(createValue());
    });
    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: Value) {
      store.setTable(tableId, value);
    },
    update(updater: (value: Value) => Value) {
      store.setTable(tableId, updater(store.getTable(tableId)));
    },
  } satisfies Writable<Value>;
}
