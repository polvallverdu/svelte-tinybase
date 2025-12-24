<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Store } from "tinybase/with-schemas";
  import { setDefaultStore } from "../context.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    store: Store<T>;
    children: Snippet;
  }

  const { store, children }: Props = $props();

  setDefaultStore(store);
</script>

{@render children()}
