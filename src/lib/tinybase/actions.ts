import type { Id, OptionalSchemas, Store, Checkpoints } from "tinybase/with-schemas";
import type { CellIdFromSchema, TableIdFromSchema, ValueIdFromSchema } from "./types.js";

// =============================================================================
// Cell Actions
// =============================================================================

/**
 * Creates a callback to set a cell value in a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to set a cell value
 *
 * @example
 * ```ts
 * const setCell = useSetCell(store);
 * setCell('pets', 'fido', 'color', 'brown');
 * ```
 */
export function useSetCell<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>, CellId extends CellIdFromSchema<T[0], TableId>>(
    tableId: TableId,
    rowId: Id,
    cellId: CellId,
    value: Parameters<typeof store.setCell<TableId, CellId>>[3],
  ) => {
    store.setCell(tableId, rowId, cellId, value);
  };
}

/**
 * Creates a callback to delete a cell from a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to delete a cell
 *
 * @example
 * ```ts
 * const delCell = useDelCell(store);
 * delCell('pets', 'fido', 'color');
 * ```
 */
export function useDelCell<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>, CellId extends CellIdFromSchema<T[0], TableId>>(
    tableId: TableId,
    rowId: Id,
    cellId: CellId,
    forceDel?: boolean,
  ) => {
    store.delCell(tableId, rowId, cellId, forceDel);
  };
}

// =============================================================================
// Row Actions
// =============================================================================

/**
 * Creates a callback to add a row to a TinyBase table.
 * Returns the ID of the newly created row.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to add a row
 *
 * @example
 * ```ts
 * const addRow = useAddRow(store);
 * const rowId = addRow('pets', { name: 'Felix', species: 'cat' });
 * ```
 */
export function useAddRow<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>>(
    tableId: TableId,
    row: Parameters<typeof store.addRow<TableId>>[1],
    reuseRowIds?: boolean,
  ) => {
    return store.addRow(tableId, row, reuseRowIds);
  };
}

/**
 * Creates a callback to set a row in a TinyBase table.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to set a row
 *
 * @example
 * ```ts
 * const setRow = useSetRow(store);
 * setRow('pets', 'fido', { name: 'Fido', species: 'dog', color: 'brown' });
 * ```
 */
export function useSetRow<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>>(
    tableId: TableId,
    rowId: Id,
    row: Parameters<typeof store.setRow<TableId>>[2],
  ) => {
    store.setRow(tableId, rowId, row);
  };
}

/**
 * Creates a callback to partially update a row in a TinyBase table.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to partially update a row
 *
 * @example
 * ```ts
 * const setPartialRow = useSetPartialRow(store);
 * setPartialRow('pets', 'fido', { color: 'brown' }); // Only updates color
 * ```
 */
export function useSetPartialRow<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>>(
    tableId: TableId,
    rowId: Id,
    partialRow: Parameters<typeof store.setPartialRow<TableId>>[2],
  ) => {
    store.setPartialRow(tableId, rowId, partialRow);
  };
}

/**
 * Creates a callback to delete a row from a TinyBase table.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to delete a row
 *
 * @example
 * ```ts
 * const delRow = useDelRow(store);
 * delRow('pets', 'fido');
 * ```
 */
export function useDelRow<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>>(tableId: TableId, rowId: Id) => {
    store.delRow(tableId, rowId);
  };
}

// =============================================================================
// Table Actions
// =============================================================================

/**
 * Creates a callback to set an entire table in a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to set a table
 *
 * @example
 * ```ts
 * const setTable = useSetTable(store);
 * setTable('pets', {
 *   fido: { name: 'Fido', species: 'dog' },
 *   felix: { name: 'Felix', species: 'cat' },
 * });
 * ```
 */
export function useSetTable<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>>(
    tableId: TableId,
    table: Parameters<typeof store.setTable<TableId>>[1],
  ) => {
    store.setTable(tableId, table);
  };
}

/**
 * Creates a callback to delete an entire table from a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to delete a table
 *
 * @example
 * ```ts
 * const delTable = useDelTable(store);
 * delTable('pets');
 * ```
 */
export function useDelTable<T extends OptionalSchemas>(store: Store<T>) {
  return <TableId extends TableIdFromSchema<T[0]>>(tableId: TableId) => {
    store.delTable(tableId);
  };
}

/**
 * Creates a callback to set all tables in a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to set all tables
 *
 * @example
 * ```ts
 * const setTables = useSetTables(store);
 * setTables({
 *   pets: { fido: { name: 'Fido' } },
 *   owners: { alice: { name: 'Alice' } },
 * });
 * ```
 */
export function useSetTables<T extends OptionalSchemas>(store: Store<T>) {
  return (tables: Parameters<typeof store.setTables>[0]) => {
    store.setTables(tables);
  };
}

/**
 * Creates a callback to delete all tables from a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to delete all tables
 *
 * @example
 * ```ts
 * const delTables = useDelTables(store);
 * delTables();
 * ```
 */
export function useDelTables<T extends OptionalSchemas>(store: Store<T>) {
  return () => {
    store.delTables();
  };
}

// =============================================================================
// Value Actions
// =============================================================================

/**
 * Creates a callback to set a value in a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to set a value
 *
 * @example
 * ```ts
 * const setValue = useSetValue(store);
 * setValue('theme', 'dark');
 * ```
 */
export function useSetValue<T extends OptionalSchemas>(store: Store<T>) {
  return <ValueId extends ValueIdFromSchema<T>>(
    valueId: ValueId,
    value: Parameters<typeof store.setValue<ValueId>>[1],
  ) => {
    store.setValue(valueId, value);
  };
}

/**
 * Creates a callback to delete a value from a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to delete a value
 *
 * @example
 * ```ts
 * const delValue = useDelValue(store);
 * delValue('theme');
 * ```
 */
export function useDelValue<T extends OptionalSchemas>(store: Store<T>) {
  return <ValueId extends ValueIdFromSchema<T>>(valueId: ValueId) => {
    store.delValue(valueId);
  };
}

/**
 * Creates a callback to set all values in a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to set all values
 *
 * @example
 * ```ts
 * const setValues = useSetValues(store);
 * setValues({ theme: 'dark', language: 'en' });
 * ```
 */
export function useSetValues<T extends OptionalSchemas>(store: Store<T>) {
  return (values: Parameters<typeof store.setValues>[0]) => {
    store.setValues(values);
  };
}

/**
 * Creates a callback to partially update values in a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to partially update values
 *
 * @example
 * ```ts
 * const setPartialValues = useSetPartialValues(store);
 * setPartialValues({ theme: 'dark' }); // Only updates theme
 * ```
 */
export function useSetPartialValues<T extends OptionalSchemas>(store: Store<T>) {
  return (partialValues: Parameters<typeof store.setPartialValues>[0]) => {
    store.setPartialValues(partialValues);
  };
}

/**
 * Creates a callback to delete all values from a TinyBase store.
 *
 * @template T - The type of the store's schemas
 * @param store - The TinyBase store instance
 * @returns A function to delete all values
 *
 * @example
 * ```ts
 * const delValues = useDelValues(store);
 * delValues();
 * ```
 */
export function useDelValues<T extends OptionalSchemas>(store: Store<T>) {
  return () => {
    store.delValues();
  };
}

// =============================================================================
// Checkpoint Actions
// =============================================================================

/**
 * Creates a callback to add a checkpoint in TinyBase checkpoints.
 *
 * @template T - The type of the store's schemas
 * @param checkpoints - The TinyBase Checkpoints instance
 * @returns A function to add a checkpoint
 *
 * @example
 * ```ts
 * const addCheckpoint = useAddCheckpoint(checkpoints);
 * addCheckpoint('Before edit');
 * ```
 */
export function useAddCheckpoint<T extends OptionalSchemas>(checkpoints: Checkpoints<T>) {
  return (label?: string) => {
    return checkpoints.addCheckpoint(label);
  };
}

/**
 * Creates a callback to go to a specific checkpoint.
 *
 * @template T - The type of the store's schemas
 * @param checkpoints - The TinyBase Checkpoints instance
 * @returns A function to go to a checkpoint
 *
 * @example
 * ```ts
 * const goToCheckpoint = useGoToCheckpoint(checkpoints);
 * goToCheckpoint('checkpoint-1');
 * ```
 */
export function useGoToCheckpoint<T extends OptionalSchemas>(checkpoints: Checkpoints<T>) {
  return (checkpointId: Id) => {
    checkpoints.goTo(checkpointId);
  };
}

/**
 * Creates a callback to go backward to the previous checkpoint (undo).
 *
 * @template T - The type of the store's schemas
 * @param checkpoints - The TinyBase Checkpoints instance
 * @returns A function to undo
 *
 * @example
 * ```ts
 * const undo = useUndo(checkpoints);
 * undo();
 * ```
 */
export function useUndo<T extends OptionalSchemas>(checkpoints: Checkpoints<T>) {
  return () => {
    checkpoints.goBackward();
  };
}

/**
 * Creates a callback to go forward to the next checkpoint (redo).
 *
 * @template T - The type of the store's schemas
 * @param checkpoints - The TinyBase Checkpoints instance
 * @returns A function to redo
 *
 * @example
 * ```ts
 * const redo = useRedo(checkpoints);
 * redo();
 * ```
 */
export function useRedo<T extends OptionalSchemas>(checkpoints: Checkpoints<T>) {
  return () => {
    checkpoints.goForward();
  };
}
