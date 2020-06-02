const fs = require('fs');
const http = require('http');

const overview = fs.readFileSync(__dirname + '/templates/overview.html', 'utf-8');
const product = fs.readFileSync(__dirname + '/templates/product.html', 'utf-8');
const card = fs.readFileSync(__dirname + '/templates/card.html', 'utf-8');
const dataFile = fs.readFileSync(__dirname + '/dev-data/data.json', 'utf-8');
const data = JSON.parse(dataFile)

const cardHtml = data.map(item => {
    let output = card.replace('{%emoji}', item.image);
    output = output.replace('{%fruit}', item.productName);
    output = output.replace('{%quantity}', item.quantity);
    output = output.replace('{%price}', item.price);
    output = output.replace('{%organic}', item.organic ? 'Organic' : '')

    return output
})

const overviewFinal = overview.replace('{%cards}', cardHtml)

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/overview') {
        res.end(overviewFinal)
    } else if (req.url === '/product') {
        res.end(product)
    } else {
        res.end('<h1>404 not found</h1>')
    }
})

server.listen('3000', '127.0.0.1')