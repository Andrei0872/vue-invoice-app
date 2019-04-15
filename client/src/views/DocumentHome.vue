<template>
    <div>
        <transition name="slide" mode="out-in">
            <router-view class="transition-comp" :key="$route.fullPath"></router-view>
        </transition>
    </div>
</template>

<script>
import titleMixin from '../mixins/titleMixin';

export default {
    title: 'Documents',

    mixins: [titleMixin],
}
</script>

<style lang="scss" scoped>

    .transition-comp {
        z-index: 0;
    }

    .slide-leave-active,
    .slide-enter-active {
        transition: .3s;
    }
    
    .slide-enter {
        transform: translate(150%, 0);
    }

    .slide-leave-to {
        transform: translate(-150%, 0);
    }

</style>
