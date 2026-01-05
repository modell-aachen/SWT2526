<!-- src/components/Sidebar/Sidebar.vue -->
<template>
  <aside
    data-testid="sidebar-container"
    class="w-72 flex flex-col gap-2 p-3 bg-ma-grey-100 border-r border-ma-grey-300 shrink-0 h-full"
  >
    <h3 class="text-lg font-semibold mb-4">Shapes</h3>

    <!-- Draggable shape items -->
    <div class="flex flex-col gap-2 mb-4">
      <SidebarShapeItem shape-type="rectangle" />
      <SidebarShapeItem shape-type="triangle" />
      <SidebarShapeItem shape-type="trapezoid" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import SidebarShapeItem from './SidebarShapeItem.vue'
</script>
