<script setup lang="ts">
defineProps<{
  title: string
  summary: string
  projects: string[]
  href: string
}>()
</script>

<template>
  <a class="source-card" :href="href">
    <strong>{{ title }}</strong>
    <span>{{ summary }}</span>
    <ul>
      <li v-for="project in projects" :key="project">{{ project }}</li>
    </ul>
  </a>
</template>
