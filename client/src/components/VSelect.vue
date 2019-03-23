<template>
    <select @change="$emit('addProvider', items[$event.target.selectedIndex])">
        <option
            v-for="item in items"
            :key="item.id"
            :value="item.id"
        >
            {{ item.name }}
        </option>
    </select>
</template>

<script>
export default {
    props: {
        items: Array
    },

    created () {
        this.$store.commit('SET_PROVIDER', this.items[0]);
    }
}
</script>
