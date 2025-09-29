<template>
  <main class="hub">
    <section class="grid">
      <div class="placeholder">Widget grid placeholder</div>
    </section>
    <footer class="bottom-panel">Bottom panel placeholder</footer>
  </main>
</template>

<script setup lang="ts">
const appName = useRuntimeConfig().public.appName
useHead({ title: appName })
</script>

<style scoped>
.hub {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100vh;
  background: #0d1117;
  color: #f0f6fc;
}

.grid {
  padding: 2rem;
  display: grid;
  place-content: center;
  border-bottom: 2px solid rgba(240, 246, 252, 0.1);
}

.bottom-panel {
  padding: 1.5rem;
  background: rgba(13, 17, 23, 0.85);
}
</style>
