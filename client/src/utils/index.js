export const capitalize = ([first, ...rest]) => `${first.toUpperCase()}${rest.join('')}`

// eslint-disable-next-line
export const getRidOfObjProp = (obj, prop, { [prop]: _, ...rest } = obj) => rest

/**
 * @example
 * returns "30/03/2019"
 * formDate("2019-03-30T15:34:59.000Z")
 */
export const formatDate = dateStr => dateStr.replace(/(?<year>\d{4})\-(?<month>\d{2})\-(?<day>\d{2})([a-zA-Z:0-9.]+)/, '$<day>/$<month>/$<year>')

// Not using arrow function because we need to bind `this`(Vue instance)
export const fetchExcelFile = async function (url, rowIndex, id) {
    let link;
    
    if (!this.allItems.length) {
        await this.fetchById(id);
    }

    const config = {
        headers: new Headers({
           'Content-type': 'application/json',
           'responseType': 'arraybuffer'
       }),
       method: "POST",
       body: JSON.stringify({
           fileType: 'excel', 
           id, 
           vat: this.$store.getters['dashboard/getCurrentVat'],
           products: this.documentProducts,
        })
   }
    
    return fetch(url, config)
        .then(res => res.arrayBuffer())
        .then(res => {

            const blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

            link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `document${rowIndex + 1}.xlsx`;
            link.click();
            link = null;
        })
        .finally(() => {
            link = null;
        })
}

export const formatColumnName = column => column.split('_').map(capitalize).join(' ');

/**
 * Receives an array of objects and determines whether any item has empty values
 * 
 * @param {Array} arr 
 */
export const hasEmptyValues = arr => arr.some(obj => Object.values(obj).some(val => typeof val !== 'object' && val.trim() === ''))

/**
 * Used mostly when parsing data that is stored in History table
 * in order to show the user the previous and current states
 * 
 * @param {String} kvPair 
 * @param {String} separator 
 * 
 * @example
 * returns ['name', 'mozzarella']
 * separateValues('name:mozzarella', ':')
 */
export const separateValues = (kvPair, separator) => {
    const sepIndex = kvPair.indexOf(separator);
    const key = kvPair.slice(0, sepIndex);
    const value = kvPair.slice(sepIndex + 1);

    return [key, value];
}

export const compareObjects = (pristineObj, changedObj, cbWhenChangeFound = undefined) => {
    return Object.entries(changedObj)
        .reduce((changes, [key, value]) => {
            if (`${pristineObj[key]}` !== `${value}`) {
                changes[key] = value
                
                if (cbWhenChangeFound !== undefined) 
                    cbWhenChangeFound(pristineObj, changedObj, key);
            }

            return changes;
        }, {})
};

export const isObjectEmpty = obj => Object.keys(obj).length === 0

export const convertMapToArr = (m, keyName) => {
    if (!m.size)
        return [];

    return [...m.entries()].map(([k, v]) => ({
        [keyName]: k,
        ...v
    }));
};

export const convertMapToObject = m => {
    const obj = {};

    for (const [id, itemDetails] of m) {
        obj[id] = itemDetails;
    }

    return obj;
};


/**
 * @returns
 * // - the arrays id of updated items
 *  - the column names (the union of column names)
 *  - an object which can be represented like this
 *  ```javascript
 *  const exampleObject = {
 *      'columnName': {
 *         '3': 'value of `column name` for the item with the index 3'
 *    }
 *  };
 *  ```
 */
export const convertMapToObjForAPI = m => {
    const result = {};  
    const columnNames = new Set();

    for (const [id, itemDetails] of m) {
        result[id] = {};

       for (const columnName in itemDetails) {  
            columnNames.add(columnName);

            result[id][columnName] = itemDetails[columnName];
       } 
    }

    return [result, columnNames];
};

/**
 * Check if any value from m1 has a prop that is the same as one key of m2,
 * based on a given prop
 * 
 * ```javascript
 * m1 = [[1, { name: 'andrei', product_id: 7 }], [][2, { name: 'john', product_id: 8 }]]
 * m2 = [[2, { productInfo2 }], [7, { productInfo7 }], [8, productInfo8]]
 * prop = 'product_info'
 * 
 * canJoinMapsBasedOnProp(m1, m2, prop)
 * ```
 * @returns true
 */
export const canJoinMapsBasedOnProp = (m1, m2, prop) => {
    for (const [k, v] of m1) {
        if (m2.has(v[prop]))
            return true;
    }

    return false;
};

export const getPropertiesOfNestedObj = obj => {
    for (const p in obj) {
        return Object.keys(obj[p]);
    }
};

/**
 * ```typescript
 *  return { [id: number]: { from: { ... }, to: { ... } } }
 * ```
 */
export const getDiffBetweenMapsElements = (from, to) => {
    const result = {};
    
    for (const [k, v] of to) {
        result[k] = {};
        result[k]['from'] = {};
        result[k]['to'] = {};

        for (const objProp in v) {
            result[k]['from'][objProp] = from.get(k)[objProp];
            result[k]['to'][objProp] = v[objProp];
        }
    }

    return result;
};