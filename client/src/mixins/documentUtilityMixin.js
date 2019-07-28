export default {
    methods: {
        refetchDocuments () {
            if (!this.$store.state['document'])
                return;
            
            const endpoint = 'documents';
            const entity = 'document';
            const url = this.$store.state['mainUrl'] + endpoint;

            this.$store.dispatch('api/makeGETRequest', { url, entity });
        },
    }
}