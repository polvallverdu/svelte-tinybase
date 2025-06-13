import type { Id, OptionalSchemas, Store } from "tinybase/with-schemas";
import type { CellIdFromSchema, TableIdFromSchema } from "../types.js";
import { readable, type Writable } from "svelte/store";

/**
 * Creates a reactive hook for accessing a specific cell in a TinyBase table.
 * The returned object provides a reactive value that automatically updates
 * when the underlying store changes.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @template CellId - The type of the cell ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table containing the cell
 * @param rowId - The ID of the row containing the cell
 * @param cellId - The ID of the cell to create a hook for
 * @returns An object with a reactive value property that provides access to the cell
 */
export function useCell<
  T extends OptionalSchemas,
  TableId extends TableIdFromSchema<T[0]>,
  CellId extends CellIdFromSchema<T[0], TableId>,
>(store: Store<T>, tableId: TableId, rowId: Id, cellId: CellId) {
  const createValue = () => store.getCell(tableId, rowId, cellId);

  type Value = ReturnType<typeof createValue>;

  const { subscribe } = readable<Value>(createValue(), (set) => {
    // @ts-expect-error - cellId is a string
    const listener = store.addCellListener(tableId, rowId, cellId, () => {
      set(createValue());
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: Value) {
      if (value === undefined) {
        store.delCell(tableId, rowId, cellId);
      } else {
        store.setCell(tableId, rowId, cellId, value);
      }
    },
    update(updater: (value: Value) => Value) {
      const newValue = updater(store.getCell(tableId, rowId, cellId));
      if (newValue === undefined) {
        store.delCell(tableId, rowId, cellId);
      } else {
        store.setCell(tableId, rowId, cellId, newValue);
      }
    },
  } satisfies Writable<Value>;
}
