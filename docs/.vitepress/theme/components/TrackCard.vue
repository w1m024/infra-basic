<script setup lang="ts">
defineProps<{
  id: string
  title: string
  summary: string
  output: string
  href: string
}>()
</script>

<template>
  <a class="track-card" :href="href">
    <span class="track-id">{{ id }}</span>
    <strong>{{ title }}</strong>
    <span>{{ summary }}</span>
    <em>{{ output }}</em>
  </a>
</template>
