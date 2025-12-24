<script lang="ts" generics="T extends OptionalSchemas">
  import type { Id, OptionalSchemas, Metrics } from "tinybase/with-schemas";
  import { metric } from "../hooks-advanced.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    metrics: Metrics<T>;
    metricId: Id;
    debugIds?: boolean;
    children?: Snippet<[metricValue: ReturnType<typeof metric<T>>]>;
  }

  const { metrics, metricId, debugIds = false, children }: Props = $props();

  const metricValue = metric(metrics, metricId);
</script>

{#if debugIds}
  <span data-metric-id={metricId}>
    {#if children}
      {@render children(metricValue)}
    {:else}
      {metricValue ?? ""}
    {/if}
  </span>
{:else if children}
  {@render children(metricValue)}
{:else}
  {metricValue ?? ""}
{/if}

