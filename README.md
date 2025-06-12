# svelte-tinybase

A tinybase adapter for Svelte.

## Introduction

svelte-tinybase is a library that allows you to use Tinybase with Svelte 5 in a reactive way.

Tinybase is a lightweight database for the web. It's a simple, yet powerful tool for building web applications. It's really incredible, honestly. Only problem is that they only provide first-class support for React.

So, this library is my attempt to bring the power of Tinybase to Svelte 5.

## Installation

First of all, you'll have to install the library:

- npm: `npm i svelte-tinybase`
- pnpm: `pnpm i svelte-tinybase`
- yarn: `yarn add svelte-tinybase`
- bun: `bun i svelte-tinybase`

## Usage

To use svelte-tinybase, you'll first need to have a Tinybase store initialized. You can check [tinybase's documentation](https://tinybase.org/guides/the-basics/creating-a-store/) for more information.

> You'll likely want to also explore other topics, like [schemas](https://tinybase.org/guides/schemas/using-schemas/) and [persistance](https://tinybase.org/guides/persistence/an-intro-to-persistence/).
>
> `svelte-tinybase` takes full advantage of schemas.

Once you have your store, you can start using the hooks `svelte-tinybase` provides.

### useTable

The `useTable` hook is used to always have the latest table data in a reactive way.

```ts
import { useTable } from "svelte-tinybase";

const tasks = useTable(store, "tasks");

$tasks; // contains the latest table data. It's reactive.
```

### useRow

The `useRow` hook is used to always have the latest row data in a reactive way.

```ts
import { useRow } from "svelte-tinybase";

const task = useRow(store, "tasks", "taskId");

$task; // contains the latest row data. It's reactive.
```

### useCell

The `useCell` hook is used to always have the latest cell data in a reactive way.

```ts
import { useCell } from "svelte-tinybase";

const title = useCell(store, "tasks", "taskId", "title");

$title; // contains the latest cell data. It's reactive.
```

### useValues

The `useValues` hook is used to always have the latest store values in a reactive way.

```ts
import { useValues } from "svelte-tinybase";

const values = useValues(store);

$values; // contains the latest store values. It's reactive.
```

## Reactiveness

The value will update when the data changes, which will render the new value in the UI. The value is also reactive to changes, and even bindable.

```svelte
<input bind:value={$values.title} />
```

## Examples & Demo

Feel free to check out the demo on [svelte-tinybase.polv.dev](https://svelte-tinybase.polv.dev). [Source is here](/src/demos/todo-list/TodoList.svelte)

## Inspired by

Inspired by [s1adem4n](https://github.com/s1adem4n) [(this comment)](https://github.com/tinyplex/tinybase/discussions/144#discussioncomment-12286852)
