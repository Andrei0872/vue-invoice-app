export default {
    data: () => ({
        showDetails: false
    }),

    watch: {
        showDetails(shouldDisplayModal) {
            shouldDisplayModal
                ?
                window.addEventListener("keyup", this.modalHandler) :
                window.removeEventListener("keyup", this.modalHandler)
        }
    },

    methods: {
        modalHandler(e) {
                e.which === 27 && this.closeModal();
        },

        closeModal() {
            this.showDetails = false;
            this.selectedItem = {};
        },
    }
}