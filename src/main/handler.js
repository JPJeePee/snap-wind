const superagent = require('superagent')
var fs = require("fs");
const xlsx = require('node-xlsx');
const list = []
const request = (reg, url = "https://globalwindatlas.info/api/gwa/custom/windSpeedRose") => {
    console.log('request')
    return superagent
        .post(url)
        // .charset()
        .send({
            "height": 100, "coord": [reg]
        })
        .set({
            'Accept': 'application/json, text/plain, */*',
            // Accept-Encoding: gzip, deflate, br
            // Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
            // Connection: keep-alive
            // Content-Length: 221
            'Content-Type': 'application/json;charset=UTF-8',
            // Host: globalwindatlas.info
            'Origin': 'https://globalwindatlas.info',
            'Referer': 'https://globalwindatlas.info/',
            // Sec-Fetch-Dest: empty
            // Sec-Fetch-Mode: cors
            // Sec-Fetch-Site: same-origin
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        })
        // .then(res => {
        //   // console.log(res.text)
        //   return res
        // })
        .catch(err => {
            return Promise.resolve({
                error: new Error('请求失败：', err)
            })
        })
    // .set('Cookie', cookie)
    // .then((res) => {
    //   console.log(res.text)
    // });
}

// request([[[80, 39]
//   , [81, 39]
//   , [81, 40]
//   , [80, 40]
//   , [80, 39]]])
let data = []
let count = 0;
const fetch = (reg, delta, url) => {
    const curCount = count++;
    console.log('fetch: ' + curCount)
    return request(reg, url).then((res) => {
        console.log(res.text)
        console.log('fetched: ' + curCount)
        // const data = [[]];
        // data[0].push(JSON.stringify(reg))
        // data[1].push(JSON.stringify(res.text))
        // var buffer = xlsx.build([{name: "mySheetName", data: data}]);
        if (res.error) {
            return
        }

        data.push([JSON.stringify([reg[0][0] + delta / 2, reg[0][1] + delta / 2]), 'value', 'sector', 'center_degrees'])
        // console.log(JSON.parse(res.text));
        JSON.parse(res.text).rose.forEach((r) => {
            const result = ['', r.value, r.sector, r.center_degrees]
            data.push(result)
        })

        if (list.length !== 0) {
            const nextReg = list.shift()
            return fetch(nextReg, delta, url)
        }
    })
}


const handler = ({ minX, minY, maxX, maxY, delta, url, parallel = 50 }) => {
    console.log(minX, minY, maxX, maxY, delta)
    for (let i = minX; i < maxX;) {
        for (let j = minY; j < maxY;) {
            let reg = [[i, j], [i + delta, j], [i + delta, j + delta], [i, j + delta], [i, j]]
            list.push(reg)
            j += delta
        }
        i += delta
    }
    return Promise.all(list.splice(0, parallel).map((reg) => fetch(reg, delta, url))).then(() => {
        return Promise.resolve(data);
    })
}

// handler(30, 40, 31, 41, 0.1).then(() => {
//     const buffer = xlsx.build([{ name: "mySheetName", data }])
//     fs.writeFile('./test.xlsx', buffer, (res) => {
//         console.log(res)
//     })
// })
export default handler
