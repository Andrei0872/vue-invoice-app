<template>
    <div class="list">
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
    </div>
</template>

<script>
export default {
    name: 'list',

    mounted () {
        this.$emit('ready', this.$el.getBoundingClientRect())
    }
}
</script>

<style lang="scss" scoped>
    $bg-color: lighten(#F4F4F7, 20%);
    $text-color: #303753;

    .list {
        background-color: $bg-color;
        color: $text-color;
        position: absolute;
        z-index: 100;
        max-height: 15rem;
    }
</style>