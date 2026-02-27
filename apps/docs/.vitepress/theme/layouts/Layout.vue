<script setup>
import { useData } from "vitepress";
import DefaultTheme, { useSidebar } from "vitepress/theme";
import { computed } from "vue";

const { Layout } = DefaultTheme;
const { hasSidebar } = useSidebar();
const { frontmatter } = useData();
const isHome = computed(() => frontmatter.value.layout === "home");
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <div v-if="isHome" class="version-banner">
        <span>
          For 2.x docs, visit
          <a href="https://v2.js.midl.xyz">v2.js.midl.xyz</a>
        </span>
      </div>
    </template>
    <template #layout-bottom>
      <div class="footer-legal" :class="{ 'has-sidebar': hasSidebar }">
        <a href="/terms-of-use">Terms of Use</a>
        <a href="/privacy-notice">Privacy Notice</a>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.footer-legal {
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);

  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer-legal a {
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--vp-c-text-1);
  }
}

.footer-legal.has-sidebar {
  justify-content: flex-start;
  padding-left: calc(
    (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 32px
  );
}
</style>
