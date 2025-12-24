import type { Id, OptionalSchemas, Row, Store, Table } from "tinybase/with-schemas";
import type { CellIdFromSchema, TableIdFromSchema, ValueIdFromSchema } from "./types.js";

/**
 * Creates a ProxyHandler for a TinyBase row that enables reactive updates
 * when row data is modified. This handler intercepts property mutations
 * and updates the store granularly at the cell level.
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

      if (value === undefined) {
        store.delCell(tableId, rowId, prop as CellIdFromSchema<T[0], TableId>);
      } else {
        store.setCell(tableId, rowId, prop as CellIdFromSchema<T[0], TableId>, value);
      }
      return true;
    },
    deleteProperty(_, prop) {
      if (typeof prop !== "string") {
        throw new Error("Row property must be a string");
      }

      store.delCell(tableId, rowId, prop as CellIdFromSchema<T[0], TableId>);
      return true;
    },
  };
}

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
      if (!val || typeof prop !== "string") return val;

      // Create nested proxy for row-level granular updates
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
    deleteProperty(_, prop) {
      if (typeof prop !== "string") {
        throw new Error("Table property must be a string");
      }

      store.delRow(tableId, prop);
      return true;
    },
  };
}

/**
 * Creates a reactive writable for a specific cell in a TinyBase table.
 * The returned object provides a `value` property that can be read and written,
 * automatically syncing with the store in both directions.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @template CellId - The type of the cell ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table containing the cell
 * @param rowId - The ID of the row containing the cell
 * @param cellId - The ID of the cell
 * @returns An object with a reactive `value` property for the cell
 *
 * @example
 * ```svelte
 * <script>
 *   const name = cellWritable(store, 'users', 'user1', 'name');
 * </script>
 *
 * <input bind:value={name.value} />
 * ```
 */
export function cellWritable<
  T extends OptionalSchemas,
  TableId extends TableIdFromSchema<T[0]>,
  CellId extends CellIdFromSchema<T[0], TableId>,
>(store: Store<T>, tableId: TableId, rowId: Id, cellId: CellId) {
  let cell = $state(store.getCell(tableId, rowId, cellId));

  $effect(() => {
    // @ts-expect-error - cellId is a string
    const listener = store.addCellListener(tableId, rowId, cellId, () => {
      cell = store.getCell(tableId, rowId, cellId);
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    get value() {
      return cell;
    },
    set value(newValue) {
      if (newValue === undefined) {
        store.delCell(tableId, rowId, cellId);
      } else {
        store.setCell(tableId, rowId, cellId, newValue);
      }
    },
  };
}

/**
 * Creates a reactive writable for a specific value in a TinyBase store.
 * The returned object provides a `value` property that can be read and written,
 * automatically syncing with the store in both directions.
 *
 * @template T - The type of the store's schemas
 * @template ValueId - The type of the value ID
 * @param store - The TinyBase store instance
 * @param valueId - The ID of the value
 * @returns An object with a reactive `value` property for the store value
 *
 * @example
 * ```svelte
 * <script>
 *   const theme = valueWritable(store, 'theme');
 * </script>
 *
 * <select bind:value={theme.value}>
 *   <option value="light">Light</option>
 *   <option value="dark">Dark</option>
 * </select>
 * ```
 */
export function valueWritable<T extends OptionalSchemas, ValueId extends ValueIdFromSchema<T>>(
  store: Store<T>,
  valueId: ValueId,
) {
  let value = $state(store.getValue(valueId));

  $effect(() => {
    const listener = store.addValueListener(valueId, () => {
      value = store.getValue(valueId);
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    get value() {
      return value;
    },
    set value(newValue) {
      if (newValue === undefined) {
        store.delValue(valueId);
      } else {
        store.setValue(valueId, newValue);
      }
    },
  };
}

/**
 * Creates a reactive writable for a specific row in a TinyBase table.
 * The returned object provides a `value` property that returns a Proxy,
 * enabling granular cell-level updates when modifying individual properties.
 *
 * When you set a property on the returned row proxy (e.g., `row.value.name = 'John'`),
 * only that specific cell is updated in the store, not the entire row.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table containing the row
 * @param rowId - The ID of the row
 * @returns An object with a reactive `value` property that provides a proxied row
 *
 * @example
 * ```svelte
 * <script>
 *   const user = rowWritable(store, 'users', 'user1');
 *
 *   // Granular update - only updates the 'name' cell
 *   user.value.name = 'John';
 *
 *   // Replace entire row
 *   user.value = { name: 'Jane', age: 25 };
 * </script>
 * ```
 */
export function rowWritable<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  store: Store<T>,
  tableId: TableId,
  rowId: Id,
) {
  let row = $state(store.getRow(tableId, rowId));

  $effect(() => {
    const listener = store.addRowListener(tableId, rowId, () => {
      row = store.getRow(tableId, rowId);
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    get value() {
      return new Proxy(row, createRowHandler(store, tableId, rowId));
    },
    set value(newRow) {
      store.setRow(tableId, rowId, newRow);
    },
  };
}

/**
 * Creates a reactive writable for a TinyBase table.
 * The returned object provides a `value` property that returns a Proxy,
 * enabling granular row and cell-level updates when modifying the table.
 *
 * When you set a row on the table proxy (e.g., `table.value['row1'] = {...}`),
 * only that row is updated. When you set a cell on a nested row proxy
 * (e.g., `table.value['row1'].name = 'John'`), only that cell is updated.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID
 * @param store - The TinyBase store instance
 * @param tableId - The ID of the table
 * @returns An object with a reactive `value` property that provides a proxied table
 *
 * @example
 * ```svelte
 * <script>
 *   const users = tableWritable(store, 'users');
 *
 *   // Granular cell update
 *   users.value['user1'].name = 'John';
 *
 *   // Granular row update
 *   users.value['user2'] = { name: 'Jane', age: 25 };
 *
 *   // Replace entire table
 *   users.value = { user1: { name: 'Alice', age: 30 } };
 * </script>
 * ```
 */
export function tableWritable<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  store: Store<T>,
  tableId: TableId,
) {
  let table = $state(store.getTable(tableId));

  $effect(() => {
    const listener = store.addTableListener(tableId, () => {
      table = store.getTable(tableId);
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    get value() {
      return new Proxy(table, createTableHandler(store, tableId));
    },
    set value(newTable) {
      store.setTable(tableId, newTable);
    },
  };
}

/**
 * Creates a reactive writable for all values in a TinyBase store.
 * The returned object provides a `value` property that can be read and written,
 * automatically syncing with the store in both directions.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns An object with a reactive `value` property for all store values
 *
 * @example
 * ```svelte
 * <script>
 *   const allValues = valuesWritable(store);
 *
 *   // Read all values
 *   console.log(allValues.value);
 *
 *   // Replace all values
 *   allValues.value = { theme: 'dark', language: 'en' };
 * </script>
 * ```
 */
export function valuesWritable<T extends OptionalSchemas>(store: Store<T>) {
  let values = $state(store.getValues());

  $effect(() => {
    const listener = store.addValuesListener(() => {
      values = store.getValues();
    });

    return () => {
      store.delListener(listener);
    };
  });

  return {
    get value() {
      return values;
    },
    set value(newValues) {
      store.setValues(newValues);
    },
  };
}
