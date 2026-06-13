<script setup lang="ts">
defineProps<{
  title: string
  summary: string
  href: string
}>()
</script>

<template>
  <a class="metric-badge" :href="href">
    <strong>{{ title }}</strong>
    <span>{{ summary }}</span>
  </a>
</template>
