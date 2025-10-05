<template>
  <div class="legal-layout">
    <div class="vp-doc container">
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
</style>
