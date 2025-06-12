import type { Id, OptionalSchemas, Row, Store, Table } from "tinybase/with-schemas";
import type { CellIdFromSchema, TableIdFromSchema } from "./types.js";
import { readable, writable, type Writable } from "svelte/store";

/**
 * Creates a ProxyHandler for a TinyBase table that enables reactive updates
 * when table data is modified. This handler intercepts property access and
 * mutations to maintain synchronization with the store.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table to create a handler for
 * @returns A ProxyHandler that enables reactive table operations
 */
function createTableHandler<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  store: Store<T>,
  tableId: TableId,
): ProxyHandler<Table<T[0], TableId, false>> {
  return {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (!val) return val;

      // nested proxies :D
      const handler = createRowHandler(store, tableId, prop as Id);
      return new Proxy(val, handler);
    },
    set(_, prop, value) {
      if (typeof prop !== "string") {
        throw new Error("Table property must be a string");
      }

      store.setRow(tableId, prop, value);
      return true;
    },
  };
}

/**
 * Creates a ProxyHandler for a TinyBase row that enables reactive updates
 * when row data is modified. This handler intercepts property access and
 * mutations to maintain synchronization with the store.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table containing the row
 * @param rowId - The ID of the row to create a handler for
 * @returns A ProxyHandler that enables reactive row operations
 */
function createRowHandler<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  store: Store<T>,
  tableId: TableId,
  rowId: Id,
): ProxyHandler<Row<T[0], TableId, false>> {
  return {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value) {
      if (typeof prop !== "string") {
        throw new Error("Row property must be a string");
      }

      store.setCell(tableId, rowId, prop, value);
      return true;
    },
  };
}

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
  const createValue = () => new Proxy(store.getTable(tableId), createTableHandler(store, tableId));

  const { subscribe } = writable(createValue(), (set) => {
    const listener = store.addTableListener(tableId, () => {
      set(createValue());
    });
    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: Table<T[0], TableId, false>) {
      store.setTable(tableId, value);
    },
    update(updater: (value: Table<T[0], TableId, false>) => Table<T[0], TableId, false>) {
      store.setTable(tableId, updater(store.getTable(tableId)));
    },
  } as Writable<Table<T[0], TableId, false>>;
}

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
  const createValue = () => new Proxy(store.getRow(tableId, rowId), createRowHandler(store, tableId, rowId));

  const { subscribe } = writable(createValue(), (set) => {
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
  } as Writable<Row<T[0], TableId, false>>;
}

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
  const { subscribe } = writable(store.getCell(tableId, rowId, cellId), (set) => {
    // @ts-expect-error - cellId is a string
    const listener = store.addCellListener(tableId, rowId, cellId, () => {
      set(store.getCell(tableId, rowId, cellId));
    });
    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: unknown) {
      if (value === undefined) {
        store.delCell(tableId, rowId, cellId);
      } else {
        // @ts-expect-error - value is any
        store.setCell(tableId, rowId, cellId, value);
      }
    },
    update(updater: (value: unknown) => unknown) {
      const newValue = updater(store.getCell(tableId, rowId, cellId));
      if (newValue === undefined) {
        store.delCell(tableId, rowId, cellId);
      } else {
        // @ts-expect-error - newValue is any
        store.setCell(tableId, rowId, cellId, newValue);
      }
    },
  } as Writable<unknown>;
}

/**
 * Creates a reactive hook for accessing TinyBase store values.
 * The returned object provides a reactive value that automatically updates
 * when the underlying store values change.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns An object with a reactive value property that provides access to the store values
 */
export function useValues<T extends OptionalSchemas>(store: Store<T>) {
  const { subscribe } = readable(store.getValues(), (set) => {
    const listener = store.addValuesListener(() => {
      set(store.getValues());
    });
    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: Record<string, unknown>) {
      store.setValues(value);
    },
    update(updater: (value: Record<string, unknown>) => Record<string, unknown>) {
      store.setValues(updater(store.getValues()));
    },
  } as Writable<Record<string, unknown>>;
}
