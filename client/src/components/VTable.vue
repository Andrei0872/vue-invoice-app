<script>
const createTableBody = (h, row, fields, fn) => {
    return h('tr', [
        ...fields.map(field =>  h('td', {
            on: { click: fn.bind(null, row.id) }
        }, row[field]))
    ])
}   

export default {
    name: 'table-comp',

    functional: true,

    props: {
        data: Array,
        fields: Array
    },

    render (h, context) {
        let { fields, data } = context.props;
        // console.log(context)

        const fieldsVal = fields.map(field => h('th', field));
        data = data.map(row => createTableBody(h, row, fields, context.listeners.showInfo))

        return h('div', { class: 'table_responsive' }, [
            h('table', { class: 'table' }, [
                h('thead', [h('tr', fieldsVal)]),
                h('tbody', data)
            ])
        ])
    }   
}

</script>

<style lang="scss"scoped>
.table {
    border-collapse: collapse;
    background-color: #FFF;
    border-radius: 13px;
    width: 100%;

    td, th {
        padding: 15px;
        text-align: center;
    }

    tbody tr:hover {
        background-color: rgba($color: #394263, $alpha: .5);
        cursor: pointer;
    }

    thead {
        background-color: darken($color: #394263, $amount: 5%);
        color: #fff;
        font-weight: 300;

        tr {            

            th:not(:last-child) {
                border-right: 1px solid #ccc;
            }

            th:first-child {
                border-top-left-radius: 13px;
            }

            th:last-child {
                border-top-right-radius: 13px;
            }
        }
    }

    tbody {
        tr>td:not(:last-child) {
            border-right: 1px solid #ccc;
        }

        tr:last-child {

            td:first-child {
                border-bottom-left-radius: 13px;
            }

            td:last-child {
                border-bottom-right-radius: 13px;
            }
        }
    }

}

.table_responsive {
    overflow-x: auto;
    padding: .9rem;
}

</style>