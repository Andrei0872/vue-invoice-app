<template>
  <div class="c-main">
    <router-view></router-view>

    <template v-if="Object.keys(modalTitles).length">
      <VModalBox 
        v-for="(title, _, index) in modalTitles" 
        :key="title" 
        :title="title"
        :closeModal="closeModal"
        :currentIndex="index"
      >
        <template v-slot:title>
          {{ title }}
        </template>
      </VModalBox>
    </template>
  </div>
</template>

<script>

import VModalBox from './components/VModalBox';
import VButton from './components/VButton';

import { getRidOfObjProp } from '@/utils/';

export default {
  name: 'main-app',
  
  components: { VModalBox, VButton },

  data: () => ({ modalTitles: {} }),

  methods: {
    closeModal (removedTitle) {
      this.modalTitles = getRidOfObjProp(this.modalTitles, removedTitle);
    },
  },

  created () {
    this.$root.$on('activateModalBox', title => {
      this.modalTitles = { ...this.modalTitles, [title]: title };
    });
  },
}
</script>

<style lang="scss">
@import './styles/base';
@import './styles/table';
@import './styles/helpers';

.c-main {
  height: 100%;
  position: relative;
  overflow-x: hidden;
}
</style>
