<script setup>
import DefaultTheme, { useSidebar } from "vitepress/theme";
const { Layout } = DefaultTheme;
const { hasSidebar } = useSidebar();
</script>

<template>
  <Layout>
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
