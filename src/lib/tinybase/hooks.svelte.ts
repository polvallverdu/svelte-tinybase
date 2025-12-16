import type { Id, OptionalSchemas, Store } from "tinybase/with-schemas";
import type { CellIdFromSchema, TableIdFromSchema, ValueIdFromSchema } from "./types.js";

/**
 * Reactive access to a cell in a TinyBase table.
 *
 * @template T - The type of the store's schemas
 * @template TableId - The type of the table ID.
 * @template CellId - The type of the cell ID.
 * @param store - The TinyBase store instance.
 * @param tableId - The ID of the table containing the cell.
 * @param rowId - The ID of the row containing the cell.
 * @param cellId - The ID of the cell to create a hook for.
 * @returns The value of the cell.
 */
export function cell<
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

  return cell;
}

/**
 * Reactive access to a row in a TinyBase table.
 *
 * @template T - The type of the store's schemas.
 * @template TableId - The type of the table ID.
 * @param store - The TinyBase store instance.
 * @param tableId - The ID of the table containing the row.
 * @param rowId - The ID of the row to access.
 * @returns The row data.
 */
export function row<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
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

  return row;
}

/**
 * Reactive access to a TinyBase table.
 *
 * @template T - The type of the store's schemas.
 * @template TableId - The type of the table ID.
 * @param store - The TinyBase store instance.
 * @param tableId - The ID of the table to access.
 * @returns The table data.
 */
export function table<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
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

  return table;
}

/**
 * Reactive access to all tables in a TinyBase store.
 *
 * @template T - The type of the store's schemas.
 * @param store - The TinyBase store instance.
 * @returns The tables data.
 */
export function tables<T extends OptionalSchemas>(store: Store<T>) {
  let tables = $state(store.getTables());

  $effect(() => {
    const listener = store.addTablesListener(() => {
      tables = store.getTables();
    });

    return () => {
      store.delListener(listener);
    };
  });

  return tables;
}

/**
 * Reactive access to all values in a TinyBase store.
 *
 * @template T - The type of the store's schemas.
 * @param store - The TinyBase store instance.
 * @returns The values data.
 */
export function values<T extends OptionalSchemas>(store: Store<T>) {
  let values = $state(store.getValues());

  $effect(() => {
    const listener = store.addValuesListener(() => {
      values = store.getValues();
    });

    return () => {
      store.delListener(listener);
    };
  });

  return values;
}

/**
 * Reactive access to a value in a TinyBase store.
 *
 * @template T - The type of the store's schemas.
 * @template ValueId - The type of the value ID.
 * @param store - The TinyBase store instance.
 * @param valueId - The ID of the value to access.
 * @returns The value data.
 */
export function value<T extends OptionalSchemas, ValueId extends ValueIdFromSchema<T>>(
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

  return value;
}

/**
 * Reactive access to sorted row IDs in a TinyBase table.
 *
 * @template T - The type of the store's schemas.
 * @template TableId - The type of the table ID.
 * @template CellId - The type of the cell ID.
 * @param tableId - The ID of the table.
 * @param cellId - The ID of the cell to sort by.
 * @param descending - Whether to sort in descending order.
 * @param offset - The offset for pagination.
 * @param limit - The limit for pagination.
 * @param store - The TinyBase store instance.
 * @returns The sorted row IDs.
 */
export function sortedRowIds<
  T extends OptionalSchemas,
  TableId extends TableIdFromSchema<T[0]>,
  CellId extends CellIdFromSchema<T[0], TableId>,
>(
  tableId: TableId,
  cellId: CellId,
  descending: boolean,
  offset: number | undefined,
  limit: number | undefined,
  store: Store<T>,
) {
  let rowIds = $state(store.getSortedRowIds(tableId, cellId, descending, offset, limit));

  $effect(() => {
    const listener = store.addSortedRowIdsListener(
      tableId,
      cellId,
      descending,
      // @ts-expect-error - offset can be undefined but listener accepts it at runtime
      offset,
      limit,
      () => {
        rowIds = store.getSortedRowIds(tableId, cellId, descending, offset, limit);
      },
    );

    return () => {
      store.delListener(listener);
    };
  });

  return $derived(rowIds);
}

/**
 * Reactive access to row IDs in a TinyBase table.
 *
 * @template T - The type of the store's schemas.
 * @template TableId - The type of the table ID.
 * @param tableId - The ID of the table.
 * @param store - The TinyBase store instance.
 * @returns The row IDs.
 */
export function rowIds<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  tableId: TableId,
  store: Store<T>,
) {
  let rowIds = $state(store.getRowIds(tableId));

  $effect(() => {
    const listener = store.addRowIdsListener(tableId, () => {
      rowIds = store.getRowIds(tableId);
    });

    return () => {
      store.delListener(listener);
    };
  });

  return $derived(rowIds);
}

/**
 * Reactive access to cell IDs in a TinyBase table row.
 *
 * @template T - The type of the store's schemas.
 * @template TableId - The type of the table ID.
 * @param tableId - The ID of the table.
 * @param rowId - The ID of the row.
 * @param store - The TinyBase store instance.
 * @returns The cell IDs.
 */
export function cellIds<T extends OptionalSchemas, TableId extends TableIdFromSchema<T[0]>>(
  tableId: TableId,
  rowId: Id,
  store: Store<T>,
) {
  let cellIds = $state(store.getCellIds(tableId, rowId));

  $effect(() => {
    const listener = store.addCellIdsListener(tableId, rowId, () => {
      cellIds = store.getCellIds(tableId, rowId);
    });

    return () => {
      store.delListener(listener);
    };
  });

  return $derived(cellIds);
}
