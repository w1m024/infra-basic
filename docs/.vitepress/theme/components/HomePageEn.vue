<script setup lang="ts">
import { withBase } from 'vitepress'
import { heroLinks, sourceTracks, startSteps, validationItems } from '../data/home-en'

const href = (path: string) => withBase(path)
</script>

<template>
  <main class="infra-home">
    <section class="home-hero" aria-labelledby="home-title">
      <p class="home-kicker">LLM Inference Infrastructure Learning System</p>
      <h1 id="home-title">
        <span class="hero-line">From CUDA to LLM Serving</span>
        <span class="hero-line">A Verifiable</span>
        <span class="hero-line">Inference Infrastructure Path</span>
      </h1>
      <p class="home-subtitle">
        Learn LLM inference infrastructure through four tracks: labs, system concepts, source reading, and open source contribution. Run it first, then benchmark, then read source, then modify code.
      </p>
      <div class="home-actions" aria-label="Home entry">
        <a
          v-for="(link, index) in heroLinks"
          :key="link.href"
          :class="index === 0 ? 'home-button primary' : 'home-button secondary'"
          :href="href(link.href)"
        >
          {{ link.text }}
        </a>
      </div>
    </section>

    <section class="home-section" aria-labelledby="start-path-title">
      <div class="home-section-heading">
        <p>Start Path</p>
        <h2 id="start-path-title">Five-Step Mainline from Scratch</h2>
      </div>
      <div class="start-grid">
        <TrackCard
          v-for="step in startSteps"
          :key="step.id"
          :id="step.id"
          :title="step.title"
          :summary="step.summary"
          :output="step.output"
          :href="href(step.href)"
        />
      </div>
    </section>

    <section class="home-section" aria-labelledby="source-tracks-title">
      <div class="home-section-heading">
        <p>Source Reading Tracks</p>
        <h2 id="source-tracks-title">Read Source by System Layer</h2>
      </div>
      <div class="source-grid">
        <SourceProjectCard
          v-for="track in sourceTracks"
          :key="track.title"
          :title="track.title"
          :summary="track.summary"
          :projects="track.projects"
          :href="href(track.href)"
        />
      </div>
    </section>

    <section class="home-section validation-section" aria-labelledby="validation-title">
      <div class="home-section-heading">
        <p>Validation</p>
        <h2 id="validation-title">Prove You Learned It</h2>
      </div>
      <div class="validation-grid">
        <MetricBadge
          v-for="item in validationItems"
          :key="item.title"
          :title="item.title"
          :summary="item.summary"
          :href="href(item.href)"
        />
      </div>
    </section>
  </main>
</template>
