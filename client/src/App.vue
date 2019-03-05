<template>
  <main class="main">

    <header>
      <VHeader />
    </header>

    <aside>
      <VSidebar />
    </aside>

    <section>
      <router-view></router-view>
    </section>

  </main>
</template>

<script>
import VSidebar from './components/VSidebar';
import VHeader from './components/VHeader';
import Dashboard from './views/Dashboard';

export default {
  name: 'mainApp',
  components: {
    VSidebar,
    VHeader,
    Dashboard,
  }
}
</script>

<style lang="scss">
  @import './styles/base';

  .main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: $sidebar-width auto;
    grid-template-rows: 40px auto;
  }

  aside {
    grid-row: 1 / -1;
  }

  header {
    background-color: orange;
  }

  section {
    grid-row: 2 / -1;
    background-color: red;
  }
</style>