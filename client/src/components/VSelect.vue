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
        items: Array,
        selectedFieldId: {
            type: Number,
            default: -1
        }
    },

    created () {
        this.$store.commit('SET_PROVIDER', (this.selectedFieldId !== -1 ? this.items.find(({ id }) => id === this.selectedFieldId) : this.items[0]));
    },

    mounted () {
        this.selectedFieldId !== -1 && (this.$el.value = this.selectedFieldId)
    }
}
</script>
