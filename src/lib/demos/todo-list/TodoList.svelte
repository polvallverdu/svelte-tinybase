<script lang="ts">
  import { useTable } from "$lib/tinybase/hooks.svelte.js";
  import TodoListItem from "./TodoListItem.svelte";
  import { todoListStore } from "./todoListStore.svelte";
  import { nanoid } from "nanoid";

  const tasks = useTable(todoListStore, "tasks");
  let newTaskTitle = $state("");

  function addTask() {
    if (newTaskTitle.trim()) {
      todoListStore.setRow("tasks", nanoid(), {
        title: newTaskTitle.trim(),
        completed: false,
      });
      newTaskTitle = "";
    }
  }
</script>

<div class="mx-auto max-w-2xl rounded-xl bg-gray-50 p-6 shadow-sm">
  <h1 class="mb-6 text-2xl font-semibold text-gray-800">Todo List</h1>

  <div class="mb-6 flex gap-2">
    <input
      type="text"
      bind:value={newTaskTitle}
      placeholder="Add a new task..."
      onkeydown={(e) => e.key === "Enter" && addTask()}
      class="focus:ring-opacity-50 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
    />
    <button
      onclick={addTask}
      class="rounded-lg bg-green-500 px-6 py-2 font-medium text-white shadow-sm transition-all hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
      disabled={!newTaskTitle.trim()}
    >
      Add Task
    </button>
  </div>

  <div class="flex flex-col gap-3">
    {#each Object.keys($tasks) as id (id)}
      <TodoListItem taskId={id} />
    {/each}
    {#if Object.keys($tasks).length === 0}
      <div class="rounded-lg bg-white p-4 text-center text-gray-500">
        No tasks yet. Add one above!
      </div>
    {/if}
  </div>
</div>
