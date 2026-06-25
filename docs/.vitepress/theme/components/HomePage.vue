<script setup lang="ts">
import { withBase } from 'vitepress'
import { heroLinks, sourceTracks, startSteps, validationItems } from '../data/home'

const href = (path: string) => withBase(path)
</script>

<template>
  <main class="infra-home">
    <section class="home-hero" aria-labelledby="home-title">
      <p class="home-kicker">LLM 推理基础设施学习体系</p>
      <h1 id="home-title">
        <span class="hero-line">从 CUDA 到 LLM Serving</span>
        <span class="hero-line">一条可验证的</span>
        <span class="hero-line">推理基础设施路线</span>
      </h1>
      <p class="home-subtitle">
        按实验、系统概念、源码阅读和开源贡献四条线学习 LLM 推理基础设施。先跑通，再 benchmark，再读源码，再改代码。
      </p>
      <div class="home-actions" aria-label="首页入口">
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
        <p>学习路径</p>
        <h2 id="start-path-title">从零开始的五步主线</h2>
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
        <p>源码阅读轨道</p>
        <h2 id="source-tracks-title">按系统层次读源码</h2>
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
        <p>验收标准</p>
        <h2 id="validation-title">用产出证明学会了</h2>
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
