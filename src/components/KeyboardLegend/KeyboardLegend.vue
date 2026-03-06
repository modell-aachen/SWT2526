<template>
  <div class="relative">
    <button
      v-if="!showLegend"
      aria-label="Show keyboard shortcuts legend"
      class="floating-button rounded-full shadow-md p-3 border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 flex items-center justify-center w-[54px] h-[54px] group"
      @click="showLegend = true"
    >
      <Keyboard class="w-7 h-7 transition-colors" />
    </button>

    <div
      v-else
      class="legend-container backdrop-blur-md border rounded-xl shadow-2xl w-80 overflow-hidden flex flex-col transition-all duration-300 pointer-events-auto origin-bottom-left"
    >
      <div class="legend-header flex items-center justify-between p-4 border-b">
        <div class="flex items-center gap-2.5">
          <div class="legend-header-icon shadow-sm border p-1.5 rounded-lg">
            <Keyboard class="w-4 h-4" />
          </div>
          <h3 class="legend-header-title text-sm font-semibold tracking-wide">
            Keyboard Shortcuts
          </h3>
        </div>
        <button
          aria-label="Close legend"
          class="close-button hover:shadow-sm border border-transparent p-1.5 rounded-md transition-all"
          @click="showLegend = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div
        class="p-2 space-y-0.5 max-h-[60vh] overflow-y-auto custom-scrollbar"
      >
        <!-- Single keys / Non-modifier -->
        <div class="row">
          <span class="label">Delete</span>
          <div class="keys">
            <kbd class="key text-[11px]">Del</kbd>
            <span class="plus">or</span>
            <kbd class="key text-[14px]">⌫</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Move</span>
          <div class="keys gap-1.5 font-bold">
            <kbd class="key leading-none pb-0.5 pt-0.5"
              ><ArrowUp class="w-4 h-4"
            /></kbd>
            <kbd class="key leading-none pb-0.5 pt-0.5"
              ><ArrowDown class="w-4 h-4"
            /></kbd>
            <kbd class="key leading-none pb-0.5 pt-0.5"
              ><ArrowLeft class="w-4 h-4"
            /></kbd>
            <kbd class="key leading-none pb-0.5 pt-0.5"
              ><ArrowRight class="w-4 h-4"
            /></kbd>
          </div>
        </div>

        <!-- Single Modifier (Ctrl/Cmd) -->
        <div class="row">
          <span class="label">Copy</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key">C</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Paste</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key">V</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Duplicate</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key">D</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Save</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key">S</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Undo</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key">Z</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Group</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key">G</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Multi Select</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key text-[12px] font-sans px-2">Click</kbd>
          </div>
        </div>

        <!-- Double Modifier (Shift + ...) -->
        <div class="row">
          <span class="label">Redo</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key text-[13px]">⇧</kbd>
            <span class="plus">+</span>
            <kbd class="key">Z</kbd>
          </div>
        </div>

        <div class="row">
          <span class="label">Ungroup</span>
          <div class="keys">
            <kbd class="key">Ctrl</kbd><span class="plus">/</span
            ><kbd class="key font-sans">⌘</kbd>
            <span class="plus">+</span>
            <kbd class="key text-[13px]">⇧</kbd>
            <span class="plus">+</span>
            <kbd class="key">G</kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Keyboard,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-vue-next'

const showLegend = ref(false)
</script>

<style scoped>
.key {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  padding-left: 0.375rem;
  padding-right: 0.375rem;
  height: 26px;
  color: var(--ma-text-01);
  background-color: var(--bg-maincontent);
  border: 1px solid var(--dashboard-border-color);
  border-bottom-width: 3px;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-family:
    ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  font-weight: 600;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.row:hover {
  background-color: var(--toolbar-btn-bg-hover);
}
.label {
  font-size: 13px;
  color: var(--ma-text-02);
  font-weight: 500;
  letter-spacing: 0.025em;
}
.keys {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.plus {
  color: var(--ma-text-03);
  font-size: 11px;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
  font-weight: 700;
}

/* Custom scrollbar for a cleaner look */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--ma-grey-400);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--ma-grey-500);
}

.legend-container {
  background-color: var(--ma-grey-100);
  border-color: var(--ma-grey-300);
}
.legend-header {
  border-bottom-color: var(--ma-grey-300);
  background-color: transparent;
}
.legend-header-title {
  color: var(--ma-text-01);
}
.legend-header-icon {
  background-color: var(--ma-grey-100);
  border-color: var(--ma-grey-300);
}
.legend-header-icon svg {
  color: var(--ma-text-02);
}
.close-button {
  color: var(--ma-text-03);
}
.close-button:hover {
  color: var(--ma-text-01);
  background-color: var(--ma-grey-200);
  border-color: var(--ma-grey-300);
}

.floating-button {
  background-color: var(--ma-grey-100);
  border-color: var(--ma-grey-300);
  border-radius: 9999px; /* full rounded */
  padding: 0.75rem; /* p-3 */
  width: 54px; /* original 54px size */
  height: 54px;
}
.floating-button:hover {
  background-color: var(--ma-grey-200);
}
.floating-button svg {
  color: var(--ma-text-01);
  width: 1.75rem; /* Restore w-7 */
  height: 1.75rem; /* Restore h-7 */
}
.floating-button:hover svg {
  color: var(--ma-text-01);
}
</style>
