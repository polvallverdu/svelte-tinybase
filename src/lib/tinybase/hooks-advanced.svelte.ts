import type { Id, OptionalSchemas } from "tinybase/with-schemas";
import type { Queries, Indexes, Metrics, Relationships, Checkpoints } from "tinybase/with-schemas";

/**
 * Reactive access to a result table from a TinyBase query.
 *
 * @param queries - The TinyBase Queries instance.
 * @param queryId - The ID of the query.
 * @returns The result table data.
 */
export function resultTable<Schemas extends OptionalSchemas>(
  queries: Queries<Schemas>,
  queryId: Id,
) {
  let resultTable = $state(queries.getResultTable(queryId));

  $effect(() => {
    const listener = queries.addResultTableListener(queryId, () => {
      resultTable = queries.getResultTable(queryId);
    });

    return () => {
      queries.delListener(listener);
    };
  });

  return resultTable;
}

/**
 * Reactive access to result row IDs from a TinyBase query.
 *
 * @param queries - The TinyBase Queries instance.
 * @param queryId - The ID of the query.
 * @returns The result row IDs.
 */
export function resultRowIds<Schemas extends OptionalSchemas>(
  queries: Queries<Schemas>,
  queryId: Id,
) {
  let resultRowIds = $state(queries.getResultRowIds(queryId));

  $effect(() => {
    const listener = queries.addResultRowIdsListener(queryId, () => {
      resultRowIds = queries.getResultRowIds(queryId);
    });

    return () => {
      queries.delListener(listener);
    };
  });

  return resultRowIds;
}

/**
 * Reactive access to result cell IDs from a TinyBase query row.
 *
 * @param queries - The TinyBase Queries instance.
 * @param queryId - The ID of the query.
 * @param rowId - The ID of the row.
 * @returns The result cell IDs.
 */
export function resultCellIds<Schemas extends OptionalSchemas>(
  queries: Queries<Schemas>,
  queryId: Id,
  rowId: Id,
) {
  let resultCellIds = $state(queries.getResultCellIds(queryId, rowId));

  $effect(() => {
    const listener = queries.addResultCellIdsListener(queryId, rowId, () => {
      resultCellIds = queries.getResultCellIds(queryId, rowId);
    });

    return () => {
      queries.delListener(listener);
    };
  });

  return resultCellIds;
}

/**
 * Reactive access to a result cell from a TinyBase query.
 *
 * @param queries - The TinyBase Queries instance.
 * @param queryId - The ID of the query.
 * @param rowId - The ID of the row.
 * @param cellId - The ID of the cell.
 * @returns The result cell value.
 */
export function resultCell<Schemas extends OptionalSchemas>(
  queries: Queries<Schemas>,
  queryId: Id,
  rowId: Id,
  cellId: Id,
) {
  let resultCell = $state(queries.getResultCell(queryId, rowId, cellId));

  $effect(() => {
    const listener = queries.addResultCellListener(queryId, rowId, cellId, () => {
      resultCell = queries.getResultCell(queryId, rowId, cellId);
    });

    return () => {
      queries.delListener(listener);
    };
  });

  return resultCell;
}

/**
 * Reactive access to a result row from a TinyBase query.
 *
 * @param queries - The TinyBase Queries instance.
 * @param queryId - The ID of the query.
 * @param rowId - The ID of the row in the result table.
 * @returns The result row data.
 */
export function resultRow<Schemas extends OptionalSchemas>(
  queries: Queries<Schemas>,
  queryId: Id,
  rowId: Id,
) {
  let resultRow = $state(queries.getResultRow(queryId, rowId));

  $effect(() => {
    const listener = queries.addResultRowListener(queryId, rowId, () => {
      resultRow = queries.getResultRow(queryId, rowId);
    });

    return () => {
      queries.delListener(listener);
    };
  });

  return resultRow;
}

/**
 * Reactive access to slice row IDs from a TinyBase index.
 *
 * @param indexes - The TinyBase Indexes instance.
 * @param indexId - The ID of the index.
 * @param sliceId - The ID of the slice.
 * @returns The slice row IDs.
 */
export function sliceRowIds<Schemas extends OptionalSchemas>(
  indexes: Indexes<Schemas>,
  indexId: Id,
  sliceId: Id,
) {
  let sliceRowIds = $state(indexes.getSliceRowIds(indexId, sliceId));

  $effect(() => {
    const listener = indexes.addSliceRowIdsListener(indexId, sliceId, () => {
      sliceRowIds = indexes.getSliceRowIds(indexId, sliceId);
    });

    return () => {
      indexes.delListener(listener);
    };
  });

  return sliceRowIds;
}

/**
 * Reactive access to slice IDs from a TinyBase index.
 *
 * @param indexes - The TinyBase Indexes instance.
 * @param indexId - The ID of the index.
 * @returns The slice IDs.
 */
export function sliceIds<Schemas extends OptionalSchemas>(indexes: Indexes<Schemas>, indexId: Id) {
  let sliceIds = $state(indexes.getSliceIds(indexId));

  $effect(() => {
    const listener = indexes.addSliceIdsListener(indexId, () => {
      sliceIds = indexes.getSliceIds(indexId);
    });

    return () => {
      indexes.delListener(listener);
    };
  });

  return sliceIds;
}

/**
 * Reactive access to a metric value from TinyBase metrics.
 *
 * @param metrics - The TinyBase Metrics instance.
 * @param metricId - The ID of the metric.
 * @returns The metric value.
 */
export function metric<Schemas extends OptionalSchemas>(metrics: Metrics<Schemas>, metricId: Id) {
  let metric = $state(metrics.getMetric(metricId));

  $effect(() => {
    const listener = metrics.addMetricListener(metricId, () => {
      metric = metrics.getMetric(metricId);
    });

    return () => {
      metrics.delListener(listener);
    };
  });

  return metric;
}

/**
 * Reactive access to linked row IDs from a TinyBase relationship.
 *
 * @param relationships - The TinyBase Relationships instance.
 * @param relationshipId - The ID of the relationship.
 * @param firstRowId - The ID of the first row.
 * @returns The linked row IDs.
 */
export function linkedRowIds<Schemas extends OptionalSchemas>(
  relationships: Relationships<Schemas>,
  relationshipId: Id,
  firstRowId: Id,
) {
  let linkedRowIds = $state(relationships.getLinkedRowIds(relationshipId, firstRowId));

  $effect(() => {
    const listener = relationships.addLinkedRowIdsListener(relationshipId, firstRowId, () => {
      linkedRowIds = relationships.getLinkedRowIds(relationshipId, firstRowId);
    });

    return () => {
      relationships.delListener(listener);
    };
  });

  return linkedRowIds;
}

/**
 * Reactive access to a remote row ID from a TinyBase relationship.
 *
 * @param relationships - The TinyBase Relationships instance.
 * @param relationshipId - The ID of the relationship.
 * @param localRowId - The ID of the local row.
 * @returns The remote row ID, or undefined if not found.
 */
export function remoteRowId<Schemas extends OptionalSchemas>(
  relationships: Relationships<Schemas>,
  relationshipId: Id,
  localRowId: Id,
) {
  let remoteRowId = $state(relationships.getRemoteRowId(relationshipId, localRowId));

  $effect(() => {
    const listener = relationships.addRemoteRowIdListener(relationshipId, localRowId, () => {
      remoteRowId = relationships.getRemoteRowId(relationshipId, localRowId);
    });

    return () => {
      relationships.delListener(listener);
    };
  });

  return remoteRowId;
}

/**
 * Reactive access to local row IDs from a TinyBase relationship.
 *
 * @param relationships - The TinyBase Relationships instance.
 * @param relationshipId - The ID of the relationship.
 * @param remoteRowId - The ID of the remote row.
 * @returns The local row IDs.
 */
export function localRowIds<Schemas extends OptionalSchemas>(
  relationships: Relationships<Schemas>,
  relationshipId: Id,
  remoteRowId: Id,
) {
  let localRowIds = $state(relationships.getLocalRowIds(relationshipId, remoteRowId));

  $effect(() => {
    const listener = relationships.addLocalRowIdsListener(relationshipId, remoteRowId, () => {
      localRowIds = relationships.getLocalRowIds(relationshipId, remoteRowId);
    });

    return () => {
      relationships.delListener(listener);
    };
  });

  return localRowIds;
}

/**
 * Reactive access to checkpoint IDs from TinyBase checkpoints.
 *
 * @param checkpoints - The TinyBase Checkpoints instance.
 * @returns The checkpoint IDs.
 */
export function checkpointIds<Schemas extends OptionalSchemas>(checkpoints: Checkpoints<Schemas>) {
  let checkpointIds = $state(checkpoints.getCheckpointIds());

  $effect(() => {
    const listener = checkpoints.addCheckpointIdsListener(() => {
      checkpointIds = checkpoints.getCheckpointIds();
    });

    return () => {
      checkpoints.delListener(listener);
    };
  });

  return checkpointIds;
}

/**
 * Reactive access to a checkpoint from TinyBase checkpoints.
 *
 * @param checkpoints - The TinyBase Checkpoints instance.
 * @param checkpointId - The ID of the checkpoint.
 * @returns The checkpoint data, or undefined if not found.
 */
export function checkpoint<Schemas extends OptionalSchemas>(
  checkpoints: Checkpoints<Schemas>,
  checkpointId: Id,
) {
  let checkpoint = $state(checkpoints.getCheckpoint(checkpointId));

  $effect(() => {
    const listener = checkpoints.addCheckpointListener(checkpointId, () => {
      checkpoint = checkpoints.getCheckpoint(checkpointId);
    });

    return () => {
      checkpoints.delListener(listener);
    };
  });

  return checkpoint;
}
