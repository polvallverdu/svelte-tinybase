<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Queries } from "tinybase/with-schemas";
  import { setDefaultQueries } from "../context.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    queries: Queries<T>;
    children: Snippet;
  }

  const { queries, children }: Props = $props();

  setDefaultQueries(queries);
</script>

{@render children()}
