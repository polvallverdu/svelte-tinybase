<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Checkpoints } from "tinybase/with-schemas";
  import { setDefaultCheckpoints } from "../context.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    checkpoints: Checkpoints<T>;
    children: Snippet;
  }

  const { checkpoints, children }: Props = $props();

  setDefaultCheckpoints(checkpoints);
</script>

{@render children()}

