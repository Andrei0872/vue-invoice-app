<template>
    <main class="main">

    <header>
      <TheHeader>{{ companyName }}</TheHeader>
    </header>

    <aside>
      <TheSidebar />
    </aside>

    <section>
      <router-view></router-view>
    </section>

  </main>
</template>

<script>
import TheSidebar from '../components/TheSidebar';
import TheHeader from '../components/TheHeader';
import Dashboard from '../views/Dashboard';

export default {
  name: 'mainApp',
  components: {
    TheSidebar,
    TheHeader,
    Dashboard,
  },
  data: () => ({
    companyName: 'Name of your company'
  }),
}
</script>

<style lang="scss">
  @import '../styles/base';

  .main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: $sidebar-width auto;
    grid-template-rows: 40px auto;
  }

  aside {
    z-index: 2;
    grid-row: 1 / -1;
  }

  header {
    background-color: #394263;
  }

  section {
    grid-row: 2 / -1;
    background-color: #DADAE3;
    overflow-x: visible;
    position: relative;
  }
</style>
