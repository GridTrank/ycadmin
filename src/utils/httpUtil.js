import Vue from 'vue'
import { Message,Loading  } from 'element-ui';
import config from '@/utils/config.js'
import axios from 'axios'
import qs from 'qs'
const api = {};
// axios.defaults.withCredentials = true;
axios.defaults.transformRequest = [function(data) {
    return qs.stringify(data)
}];

var instance = axios.create();
axios.defaults.withCredentials  = true;
instance.defaults.headers = { 
    "Content-Type": "application/x-www-form-urlencoded",
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Credentials':true,
}


function ajax(type,url,data,callback,failcallback,status,jsonState){
    return axios[type]( config.Domain+url , data)
    // .then( response => response.json())
    .then((result) => {
        var response = result.data;
        /*success*/
        if(status && response.code != 20000){
            callback(response);
            return;
        }
        if(response.code == 200){
            callback(response.result)
            return;
        }else if(response.code == 100001){
            location.href = '/#/login';
        }else if(response.code == 100002){

        }else{
            Message({
                type:"error",
                message:response.message,
            });
            const loading =  Loading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                fullscreen: true,
            });
            loading.close();
            typeof failcallback == "function" ? failcallback():"";
            return;
        }
    })
    .catch((error) =>{
        /*fail*/
        Message({
            type:"error",
            message:'系统错误！',
        });
        const loading =  Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            fullscreen: true,
        });
        loading.close();
        typeof failcallback == "function" ? failcallback():"";
    })
}
/*
    url : 请求地址，
    data： 请求数据，
    callback：请求成功回调，
    failcallback：请求失败回调，
    status :是否需要返回包括状态码的数据
*/
api.post = (url, data, callback,failcallback,status,jsonState) => {
    ajax('post',url,data,callback,failcallback,status,jsonState);
}
api.put = (url, data, callback,failcallback,status,jsonState) => {
    ajax('put',url,data,callback,failcallback,status,jsonState);
}
/*
    url : 请求地址，
    callback：请求成功回调，
    failcallback：请求失败回调，
    status :是否需要返回包括状态码的数据
*/

// --------------data数据直接写在链接上------------------//
api.get = (url, callback,failcallback,status) => {
    return axios.get('http://120.77.246.130:3000' + url )
    // return axios.get(config.Domain + url )
    // .then( response => response.json())
    .then((result) =>{
        var response = result.data;
        /*success*/
        if(status && response.code != 20000){
            callback(response);
            return;
        }

        if(response.code == 200){
            callback(response.result)
            return;
        }else if(response.code == 100001){
            location.href = '/#/login';
        }else if(response.code == 100002){
            location.href = '/#'+store.getters.getUserInfo.router.path;
        }else{
            Message({
                type:"error",
                message:response.message,
            });
            const loading =  Loading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                fullscreen: true,
            });
            loading.close();
            typeof failcallback == "function" ? failcallback():"";
            return;
        }
    })
    .catch((error)=>{
        /*fail*/
        Message({
            type:"error",
            message:'系统错误！',
        });
        const loading =  Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            fullscreen: true,
        });
        loading.close();
        typeof failcallback == "function" ? failcallback():"";
    })
}


export default api;
