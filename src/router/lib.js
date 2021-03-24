import {store} from './store.js'
import confluxPortal from '../lib/conflux-portal'
import {keccak256} from 'js-sha3'

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
console.info('bind date format', new Date().Format('yyyy-MM-dd hh:mm:ss'));
export const handler = {
    onError: (msg) => {
        console.error('rpc fail', msg)
    }
}

export async function getRpc(url, data = {}) {
    return rpc(url, data, 'GET')
}

export async function rpc(url, data = {}, method = 'POST', errHandler=undefined) {
    let fetchConf = {
        method: method,
        headers: {
            'HEX': store.authToken || ''
        }
    };
    if (method === 'POST') {
        fetchConf.body = JSON.stringify(data)
        fetchConf.headers["Content-Type"] = "application/json"
    }
    var err0 = undefined
    const rpc = await fetch(store.host + url, fetchConf).catch(err => {
        console.info('please check REQUEST method, url matching.', err)
        err0 = err
        if (errHandler === undefined) {
            handler.onError(`${err}`)
        } else {
            errHandler(err)
        }
    });
    if (rpc === undefined) {
        return Promise.reject(err0);
    }
    const json = await rpc.json();
    if (json.success) {
        return Promise.resolve(json.data)
    }
    if (errHandler === undefined) {
        handler.onError((rpc.status === 200 ? '' : `[${rpc.status}]`)
            + json.message);
    } else {
        errHandler(rpc, json)
    }
    json.originalUrl = url;
    return Promise.reject(json)
}

export function hexToBytes(hex) {
    let c = 0;
    if (hex.startsWith('0x')) {
        c = 2;
    }
    for (var bytes = []; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

export function doCommand(request, url, fn) {
    let time = new Date().getTime();
    request.timestamp = time;
    rpc(request.encodeType || 'system/encode', request, 'POST', ()=>{/**ignore 404 or fail*/})
        .catch(err=>{
            console.info('encode fail:', err)
            return ''
        })
        .then(hex=>{
            console.info('hex is ', hex);
            let arr = hexToBytes(hex);
            arr = keccak256.digest(arr);

            return confluxPortal.requestCfxSign(arr, this.store.account)
        }).then(portalCallback => {
            request.signature = portalCallback.result;
            return rpc(url, request);
        }).then(data => {
            // data could be raw string/bool/number or {}
            fn(data);
        }).catch(handler.onError)
}