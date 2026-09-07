import { useState, useCallback } from 'react';

export interface ColumnDef {
  id: string;
  label: string;
  visible: boolean;
  width: number;
  required?: boolean;
}

const STORAGE_PREFIX = 'ng_col_config_';

export function useColumnConfig(tableKey: string, defaultColumns: ColumnDef[]) {
  const storageKey = STORAGE_PREFIX + tableKey;

  const getInitialColumns = (): ColumnDef[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ColumnDef[];
        const merged = defaultColumns.map((def) => {
          const found = parsed.find((p) => p.id === def.id);
          return found ? { ...def, visible: found.visible, width: found.width } : def;
        });
        return merged.sort((a, b) => {
          const aIdx = parsed.findIndex((p) => p.id === a.id);
          const bIdx = parsed.findIndex((p) => p.id === b.id);
          if (aIdx === -1) return 1;
          if (bIdx === -1) return -1;
          return aIdx - bIdx;
        });
      }
    } catch {
      // ignore
    }
    return defaultColumns;
  };

  const [columns, setColumns] = useState<ColumnDef[]>(getInitialColumns);

  const persist = useCallback(
    (cols: ColumnDef[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cols));
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const saveColumns = useCallback(
    (cols: ColumnDef[]) => {
      setColumns(cols);
      persist(cols);
    },
    [persist]
  );

  const resetColumns = useCallback(() => {
    const fresh = defaultColumns.map((c) => ({ ...c }));
    setColumns(fresh);
    persist(fresh);
  }, [defaultColumns, persist]);

  const toggleVisible = useCallback(
    (id: string) => {
      setColumns((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reorderColumns = useCallback(
    (fromIdx: number, toIdx: number) => {
      setColumns((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateWidth = useCallback(
    (id: string, width: number) => {
      setColumns((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, width } : c));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { columns, saveColumns, resetColumns, toggleVisible, reorderColumns, updateWidth };
}
