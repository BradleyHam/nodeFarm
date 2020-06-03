const fs = require('fs');
const http = require('http');
const url = require('url')

const overview = fs.readFileSync(__dirname + '/templates/overview.html', 'utf-8');
const product = fs.readFileSync(__dirname + '/templates/product.html', 'utf-8');
const card = fs.readFileSync(__dirname + '/templates/card.html', 'utf-8');
const dataFile = fs.readFileSync(__dirname + '/dev-data/data.json', 'utf-8');
const data = JSON.parse(dataFile)

function replaceTemplate(temp, item) {
    let output = temp.replace(/{%emoji}/g, item.image);
    output = output.replace('{%fruit}', item.productName);
    output = output.replace('{%quantity}', item.quantity);
    output = output.replace(/{%price}/g, item.price);
    output = output.replace('{%description}', item.description);
    output = output.replace('{%from}', item.from);
    output = output.replace('{%nutrients}', item.nutrients);
    output = output.replace('{%productId}', item.id);
    output = output.replace('{%organic}', item.organic ? 'Organic' : '')
    return output
}

const cardHtml = data.map(item => {
    return replaceTemplate(card, item);
})

const overviewFinal = overview.replace('{%cards}', cardHtml)


////// server  


const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {
        res.end(overviewFinal)
    } else if (pathname === '/product') {
        const productPage = replaceTemplate(product, data[query.id])
        res.end(productPage)
    } else {
        res.end('<h1>404 not found</h1>')
    }
})

server.listen('3000', '127.0.0.1')