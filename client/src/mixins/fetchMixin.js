
export default {
    created() {
        fetch(`http://localhost:3000/${this.entityName}`, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
                method: "POST",
            })
            .then(res => res.json())
            .then(res => {

                this.items = res.data
                const fields = res.data[0];
                const {id, provider_id = null, ...rest } = fields;
                this.fields = Object.keys(rest)
            })
    }
}