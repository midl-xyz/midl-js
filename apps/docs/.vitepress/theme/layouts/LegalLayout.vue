<script setup lang="ts">
import { useData } from "vitepress";

const { page } = useData();

const lastUpdatedValue =
	page.value.frontmatter.lastUpdated || page.value.lastUpdated;

const lastUpdated = lastUpdatedValue
	? new Intl.DateTimeFormat("en-US", {
			dateStyle: "long",
		}).format(new Date(lastUpdatedValue))
	: null;
</script>

<template>
  <div class="legal-layout">
    <div class="vp-doc container">
      <h1>{{ page.title }}</h1>
      <div class="page-meta">
        <div v-if="lastUpdated"><b>Last updated:</b> {{ lastUpdated }}</div>
        <div v-if="page.frontmatter.version">
          <b>Version:</b> {{ page.frontmatter.version }}
        </div>
      </div>
      <Content />
    </div>
  </div>
</template>

<style lang="css" scoped>
.legal-layout {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

:deep(.vp-doc) {
  h2 {
    counter-increment: section;
    list-style-type: decimal;
    border-top: none;
    margin-top: 16px;
    counter-reset: subsection;

    &:before {
      content: counter(section) ". ";
    }
  }

  h2 ~ h3 {
    margin-left: 1.5rem;
    counter-increment: subsection;
    counter-reset: subsubsection;

    &:before {
      content: counter(subsection, lower-alpha) ". ";
    }

    & ~ p {
      margin-left: 1.5rem;
    }
  }

  h2 ~ h3 ~ h4 {
    margin-left: 3rem;
    counter-increment: subsubsection;

    &:before {
      content: counter(subsubsection, lower-roman) ". ";
    }

    & ~ p {
      margin-left: 1.5rem;
    }
  }
}

.page-meta {
  color: var(--vp-c-text-secondary);
  margin: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
</style>
