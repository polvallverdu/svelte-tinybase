<script lang="ts" generics="T extends OptionalSchemas">
  import type { Id, OptionalSchemas, Checkpoints } from "tinybase/with-schemas";
  import { checkpoint } from "../hooks-advanced.svelte.js";
  import type { Snippet } from "svelte";

  interface Props {
    checkpoints: Checkpoints<T>;
    checkpointId: Id;
    debugIds?: boolean;
    children?: Snippet<[checkpointLabel: ReturnType<typeof checkpoint<T>>]>;
  }

  const { checkpoints, checkpointId, debugIds = false, children }: Props = $props();

  const checkpointLabel = checkpoint(checkpoints, checkpointId);
</script>

{#if debugIds}
  <span data-checkpoint-id={checkpointId}>
    {#if children}
      {@render children(checkpointLabel)}
    {:else}
      {checkpointLabel ?? ""}
    {/if}
  </span>
{:else if children}
  {@render children(checkpointLabel)}
{:else}
  {checkpointLabel ?? ""}
{/if}

