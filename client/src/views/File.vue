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

    beforeRouteEnter (to, from, next) {
        if (!from.name) {
            return next({ name: 'documents' })
        }
        next();
    },

    async created () {
        const url = `${this.$store.getters['api/mainURL']}/file`

        const body = {
            id: this.$route.params.id,
            fileType: 'pdf',
            vat: this.$store.getters['dashboard/getCurrentVat'],
            docInfo: this.$store.getters['getEntityItems']
        }
        
        const config = { headers: new Headers({
            'Content-Type': 'application/json',
            }), 
            method: "POST",
            body: JSON.stringify(body)
        }

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
