/**
 * Types here are taken from tinybase/with-schemas (they are not exported from tinybase)
 */
import type { Id, OptionalSchemas, OptionalTablesSchema } from "tinybase/with-schemas";

type AsId<T> = Exclude<T & Id, number>;

export type TableIdFromSchema<Schema extends OptionalTablesSchema> = AsId<keyof Schema>;
export type CellIdFromSchema<
  Schema extends OptionalTablesSchema,
  TableId extends TableIdFromSchema<Schema>,
> = AsId<keyof Schema[TableId]>;
export type ValueIdFromSchema<Schema extends OptionalSchemas> = AsId<keyof Schema>;
