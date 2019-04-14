
module.exports.getPDFContent = (products, vat, docInfo) => {
    let { invoice_number, id, provider_id, provider_name, inserted_date, nr_products, ...rest } = docInfo;
    inserted_date = new Date(inserted_date).toLocaleDateString();
    
    products = products.map(({ id, document_id, product_id, isComestible, product_name, ...rest }) => ({ product_name, ...rest }))
    
    return `
        <style>
            td {
                text-align: center;
                padding: 2px;
            }

            th {
                padding: 3px;
                font-size: .85rem;
            }

            td {
                font-size: .8rem;
            }
        </style>

        <div style='float:left; margin-left: 3.5rem;'>
            <p><b>Food VAT: </b>${vat['food_vat']}%</p>
            <p><b>Non-Food VAT: </b>${vat['non_food_vat']}%</p>
            <p><b>Invoice Number: </b>${invoice_number}</p>
        </div>
        <div style='float:right; margin-right: 3.5rem;'>
            <p><b>Provider: </b>${provider_name}</p>
            <p><b>Insert Date: </b>${inserted_date}</p>
            <p><b>Nr. Products: </b>${nr_products}</p>
        </div>
        
        <table border="1" style="border-collapse: collapse; margin: 15px auto;">
            <thead>
                ${Object.keys(products[0]).map(column => '<th>' + column + '</th>').join('')}
            </thead>
            <tbody>
                <tr>
                    ${products.map(row => '<td>' + Object.values(row).join('</td><td>') + '</td>').join('</tr><tr>')}
                </tr>
            </tbody>
        </table>

        <table border="1" style="border-collapse: collapse; margin: 15px auto;">
            <thead>
                ${Object.keys(rest).map(column => '<th>' + column + '</th>').join('')}
            </thead>
            <tbody>
                <tr>
                    ${Object.values(rest).map(column => '<td>' + column + '</td>').join('')}
                </tr>
            </tbody>
        </table>
        `
    }

module.exports.getExcelContent = products => {
    return [Object.keys(products[0]), ...products.map(Object.values)]
}