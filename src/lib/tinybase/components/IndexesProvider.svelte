<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Indexes } from "tinybase/with-schemas";
  import { setDefaultIndexes } from "../context.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    indexes: Indexes<T>;
    children: Snippet;
  }

  const { indexes, children }: Props = $props();

  setDefaultIndexes(indexes);
</script>

{@render children()}

