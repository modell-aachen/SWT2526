<template>
  <div class="legend-modal bg-white rounded shadow-lg p-4 w-80 relative">
    <button
      aria-label="Close legend"
      class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
      @click="$emit('close')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <h3 class="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
    <ul class="space-y-1 text-sm">
      <li><b>Delete/Backspace</b>: Delete selected</li>
      <li><b>Ctrl/Cmd + Z</b>: Undo</li>
      <li><b>Ctrl/Cmd + Shift + Z</b> or <b>Ctrl/Cmd + Y</b>: Redo</li>
      <li><b>Ctrl/Cmd + C</b>: Copy</li>
      <li><b>Ctrl/Cmd + V</b>: Paste</li>
      <li><b>Ctrl/Cmd + D</b>: Duplicate</li>
      <li><b>Ctrl/Cmd + S</b>: Save</li>
      <li><b>Arrow Keys</b>: Move selected (hold Shift for bigger step)</li>
      <li><b>Ctrl/Cmd + G</b>: Group selected</li>
      <li><b>Ctrl/Cmd + Shift + G</b>: Ungroup selected</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
