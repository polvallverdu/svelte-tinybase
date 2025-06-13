import type { OptionalSchemas, Store } from "tinybase/with-schemas";
import { writable, type Writable } from "svelte/store";

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
  const createValue = () => store.getValues();

  type Value = ReturnType<typeof createValue>;

  const { subscribe } = writable(createValue(), (set) => {
    const listener = store.addValuesListener(() => {
      set(createValue());
    });
    return () => {
      store.delListener(listener);
    };
  });

  return {
    subscribe,
    set(value: Value) {
      store.setValues(value);
    },
    update(updater: (value: Value) => Value) {
      store.setValues(updater(store.getValues()));
    },
  } satisfies Writable<Value>;
}
