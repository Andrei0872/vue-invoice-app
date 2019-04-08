<template>
    <div class="c-file">
        <iframe
            class="c-file__display"
            v-if="src"
            :src="src"
        />
    </div>
</template>

<script>
export default {

    data: () => ({
        src: null
    }),

    created () {
        const url = `${this.$store.getters['api/mainURL']}/file/pdf/${this.$route.params.id}`
        const config = { headers: new Headers({
            'Content-Type': 'application/pdf',
        }), method: "POST" }
        
        fetch(url, config)
            .then(res => res.blob())
            .then(res => {

                const blob =  new Blob([res], {type: 'application/pdf'});
                this.src = URL.createObjectURL(blob, { type: 'application/pdf' })
            })
    
    }
}
</script>

<style lang="scss" scoped>
    .c-file {
        height: 100%;

        &__display {
            width: 100%;
            height: 100%;
        }
    }
</style>
