<script lang="ts">
  import { useRow } from "$lib/index.js";
  import { todoListStore } from "./todoListStore.svelte.js";

  const {
    taskId,
  }: {
    taskId: string;
  } = $props();

  const task = useRow(todoListStore, "tasks", taskId);

  function deleteTask() {
    todoListStore.delRow("tasks", taskId);
  }
</script>

<div
  class="group flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
>
  <input
    type="checkbox"
    bind:checked={$task.completed}
    class="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
  />
  <span class="flex-1 text-gray-700 {$task.completed ? 'text-gray-400 line-through' : ''}">
    {$task.title}
  </span>

  <button
    onclick={deleteTask}
    class="opacity-0 transition-opacity group-hover:opacity-100"
    aria-label="Delete task"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-red-500 hover:text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  </button>
</div>
