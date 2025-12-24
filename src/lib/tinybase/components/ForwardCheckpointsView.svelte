<script lang="ts" generics="T extends OptionalSchemas">
  import type { Id, OptionalSchemas, Checkpoints } from "tinybase/with-schemas";
  import { checkpointIds } from "../hooks-advanced.svelte.js";
  import CheckpointView from "./CheckpointView.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    checkpoints: Checkpoints<T>;
    debugIds?: boolean;
    separator?: string;
    checkpointComponent?: typeof CheckpointView<T>;
    children?: Snippet<[checkpointId: Id, checkpoints: Checkpoints<T>]>;
  }

  const {
    checkpoints,
    debugIds = false,
    separator = "",
    checkpointComponent,
    children,
  }: Props = $props();

  const ids = checkpointIds(checkpoints);

  // Forward checkpoints are the third element of the tuple (future checkpoints)
  const forwardIds = $derived(ids[2] ?? []);

  const CheckpointComponent = checkpointComponent ?? CheckpointView;
</script>

{#each forwardIds as checkpointId, i (checkpointId)}
  {#if i > 0 && separator}{separator}{/if}
  {#if children}
    {@render children(checkpointId, checkpoints)}
  {:else}
    <CheckpointComponent {checkpoints} {checkpointId} {debugIds} />
  {/if}
{/each}

