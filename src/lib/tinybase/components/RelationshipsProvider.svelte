<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Relationships } from "tinybase/with-schemas";
  import { setDefaultRelationships } from "../context.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    relationships: Relationships<T>;
    children: Snippet;
  }

  const { relationships, children }: Props = $props();

  setDefaultRelationships(relationships);
</script>

{@render children()}

