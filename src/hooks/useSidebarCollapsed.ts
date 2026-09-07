const COLLAPSED_KEY = 'ng_sidebar_collapsed';

type Listener = () => void;
const listeners = new Set<Listener>();

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

const state = { collapsed: getInitialCollapsed() };

function notify() {
  listeners.forEach((l) => l());
}

import { useState, useEffect } from 'react';

export function useSidebarCollapsed() {
  const [collapsed, setLocal] = useState(state.collapsed);

  useEffect(() => {
    const handler = () => setLocal(state.collapsed);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const toggle = () => {
    state.collapsed = !state.collapsed;
    try {
      localStorage.setItem(COLLAPSED_KEY, String(state.collapsed));
    } catch {
      // ignore
    }
    notify();
  };

  return { collapsed, toggle };
}
