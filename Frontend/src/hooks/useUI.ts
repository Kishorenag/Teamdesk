import { useState, useCallback } from 'react';
import { Task } from '@/types';

// Modal state management
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

// Edit task modal with data
export function useEditTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const open = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedTask(null);
  }, []);

  return { isOpen, open, close, selectedTask };
}

// Sidebar toggle
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  return { isOpen, toggle, close, open };
}

// Filter state
export function useTaskFilters() {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    searchQuery: '',
  });

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: '',
      priority: '',
      assignedTo: '',
      searchQuery: '',
    });
  }, []);

  return { filters, setFilter, clearFilters };
}
