module.exports = {
    capitalizeAndClean: name => name.replace(/(?<=_|^)([a-z]+)/g, match => match[0].toUpperCase() + match.slice(1))
}