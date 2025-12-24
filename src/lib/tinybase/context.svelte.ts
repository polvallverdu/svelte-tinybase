import { getContext, setContext } from "svelte";
import type {
  OptionalSchemas,
  Store,
  Queries,
  Indexes,
  Metrics,
  Relationships,
  Checkpoints,
} from "tinybase/with-schemas";

/**
 * Creates a type-safe context factory for any TinyBase type.
 * Returns a tuple of [get, set] functions that are properly typed.
 *
 * @template T - The type to store in the context
 * @param key - A unique symbol key for the context
 * @returns A tuple containing typed getter and setter functions
 */
function createTypedContext<T>(key: symbol): [() => T, (value: T) => T] {
  return [() => getContext<T>(key), (value: T) => setContext(key, value)];
}

/**
 * Creates a type-safe context for a TinyBase Store.
 * Returns a tuple of [getStore, setStore] functions.
 *
 * @template T - The type of the store's schemas
 * @returns A tuple containing the getter and setter for the store context
 *
 * @example
 * ```ts
 * // In a shared context file
 * export const [getStore, setStore] = createStoreContext<MySchemas>();
 *
 * // In a parent component
 * setStore(myStore);
 *
 * // In a child component
 * const store = getStore();
 * ```
 */
export function createStoreContext<T extends OptionalSchemas = OptionalSchemas>() {
  return createTypedContext<Store<T>>(Symbol("tinybase-store"));
}

/**
 * Creates a type-safe context for TinyBase Queries.
 * Returns a tuple of [getQueries, setQueries] functions.
 *
 * @template T - The type of the store's schemas
 * @returns A tuple containing the getter and setter for the queries context
 *
 * @example
 * ```ts
 * export const [getQueries, setQueries] = createQueriesContext<MySchemas>();
 * ```
 */
export function createQueriesContext<T extends OptionalSchemas = OptionalSchemas>() {
  return createTypedContext<Queries<T>>(Symbol("tinybase-queries"));
}

/**
 * Creates a type-safe context for TinyBase Indexes.
 * Returns a tuple of [getIndexes, setIndexes] functions.
 *
 * @template T - The type of the store's schemas
 * @returns A tuple containing the getter and setter for the indexes context
 *
 * @example
 * ```ts
 * export const [getIndexes, setIndexes] = createIndexesContext<MySchemas>();
 * ```
 */
export function createIndexesContext<T extends OptionalSchemas = OptionalSchemas>() {
  return createTypedContext<Indexes<T>>(Symbol("tinybase-indexes"));
}

/**
 * Creates a type-safe context for TinyBase Metrics.
 * Returns a tuple of [getMetrics, setMetrics] functions.
 *
 * @template T - The type of the store's schemas
 * @returns A tuple containing the getter and setter for the metrics context
 *
 * @example
 * ```ts
 * export const [getMetrics, setMetrics] = createMetricsContext<MySchemas>();
 * ```
 */
export function createMetricsContext<T extends OptionalSchemas = OptionalSchemas>() {
  return createTypedContext<Metrics<T>>(Symbol("tinybase-metrics"));
}

/**
 * Creates a type-safe context for TinyBase Relationships.
 * Returns a tuple of [getRelationships, setRelationships] functions.
 *
 * @template T - The type of the store's schemas
 * @returns A tuple containing the getter and setter for the relationships context
 *
 * @example
 * ```ts
 * export const [getRelationships, setRelationships] = createRelationshipsContext<MySchemas>();
 * ```
 */
export function createRelationshipsContext<T extends OptionalSchemas = OptionalSchemas>() {
  return createTypedContext<Relationships<T>>(Symbol("tinybase-relationships"));
}

/**
 * Creates a type-safe context for TinyBase Checkpoints.
 * Returns a tuple of [getCheckpoints, setCheckpoints] functions.
 *
 * @template T - The type of the store's schemas
 * @returns A tuple containing the getter and setter for the checkpoints context
 *
 * @example
 * ```ts
 * export const [getCheckpoints, setCheckpoints] = createCheckpointsContext<MySchemas>();
 * ```
 */
export function createCheckpointsContext<T extends OptionalSchemas = OptionalSchemas>() {
  return createTypedContext<Checkpoints<T>>(Symbol("tinybase-checkpoints"));
}

// Default context keys (shared symbols for default contexts)
const DEFAULT_STORE_KEY = Symbol("tinybase-default-store");
const DEFAULT_QUERIES_KEY = Symbol("tinybase-default-queries");
const DEFAULT_INDEXES_KEY = Symbol("tinybase-default-indexes");
const DEFAULT_METRICS_KEY = Symbol("tinybase-default-metrics");
const DEFAULT_RELATIONSHIPS_KEY = Symbol("tinybase-default-relationships");
const DEFAULT_CHECKPOINTS_KEY = Symbol("tinybase-default-checkpoints");

// Default contexts for convenience (untyped, for simple use cases)
export const [getDefaultStore, setDefaultStore] =
  createTypedContext<Store<OptionalSchemas>>(DEFAULT_STORE_KEY);
export const [getDefaultQueries, setDefaultQueries] =
  createTypedContext<Queries<OptionalSchemas>>(DEFAULT_QUERIES_KEY);
export const [getDefaultIndexes, setDefaultIndexes] =
  createTypedContext<Indexes<OptionalSchemas>>(DEFAULT_INDEXES_KEY);
export const [getDefaultMetrics, setDefaultMetrics] =
  createTypedContext<Metrics<OptionalSchemas>>(DEFAULT_METRICS_KEY);
export const [getDefaultRelationships, setDefaultRelationships] =
  createTypedContext<Relationships<OptionalSchemas>>(DEFAULT_RELATIONSHIPS_KEY);
export const [getDefaultCheckpoints, setDefaultCheckpoints] =
  createTypedContext<Checkpoints<OptionalSchemas>>(DEFAULT_CHECKPOINTS_KEY);
