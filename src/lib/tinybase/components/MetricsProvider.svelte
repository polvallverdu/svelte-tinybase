<script lang="ts" generics="T extends OptionalSchemas">
  import type { OptionalSchemas, Metrics } from "tinybase/with-schemas";
  import { setDefaultMetrics } from "../context.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    metrics: Metrics<T>;
    children: Snippet;
  }

  const { metrics, children }: Props = $props();

  setDefaultMetrics(metrics);
</script>

{@render children()}

