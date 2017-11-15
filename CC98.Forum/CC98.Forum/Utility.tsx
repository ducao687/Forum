﻿import * as Prop from './Props/AppProps'
import * as State from './States/AppState'
import * as React from 'react';
import { TopicTitleAndContent } from './Components/List'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import * as $ from 'jquery';
import { FocusTopic } from './Props/FocusTopic';




export async function getBoardTopicAsync(curPage, boardid) {
    const token = getLocalStorage("accessToken");
    const startPage = (curPage - 1) * 20;
    const endPage = curPage * 20 - 1;
    const boardtopics: State.TopicTitleAndContentState[] = [];
    const url = `http://apitest.niconi.cc/Topic/Board/${boardid}?from=${startPage}&size=20`;
    const response = await fetch(url,
        { headers: { 'Authorization': token } });
    const data: State.TopicTitleAndContentState[] = await response.json();
    const totalTopicCountResponse = await fetch(`http://apitest.niconi.cc/Board/${boardid}`);
    const totalTopicCountJson = await totalTopicCountResponse.json();

    const totalTopicCount = totalTopicCountJson.postCount;
    let topicNumberInPage;
    if (curPage * 20 <= totalTopicCount) {
        topicNumberInPage = 20;
    } else if (curPage === 1 && totalTopicCount < 19) {
        topicNumberInPage = totalTopicCount;
    } else {
        topicNumberInPage = (totalTopicCount - (curPage - 1) * 20);
    }
    for (let i = 0; i < topicNumberInPage; i++) {
        boardtopics[i] = new State.TopicTitleAndContentState(data[i].title, data[i].userName || '匿名', data[i].id, data[i].userId, data[i].lastPostUser, data[i].lastPostTime);
    }

    return boardtopics;

}
export async function getTopic(topicid: number) {
    let token = getLocalStorage("accessToken");
    const response = await fetch(`http://apitest.niconi.cc/Post/Topic/${topicid}?from=0&size=1`, {

        headers: { 'Authorization': token }
    });
    const data = await response.json();
    const hitCountResponse = await fetch(`http://apitest.niconi.cc/Topic/${topicid}`, { headers: { 'Authorization': token } });
    const hitCountJson = await hitCountResponse.json();
    const hitCount = hitCountJson.hitCount;
    let topicMessage = null;
    if (data[0].userId != null) {
        const userMesResponse = await fetch(`http://apitest.niconi.cc/User/${data[0].userId}`);
        const userMesJson = await userMesResponse.json();
        topicMessage = new State.TopicState(data[0].userName, data[0].title, data[0].content, data[0].time, userMesJson.signatureCode, userMesJson.portraitUrl || 'https://www.cc98.org/pic/anonymous.gif', hitCount, data[0].userId);
    } else {
        topicMessage = new State.TopicState('匿名', data[0].title, data[0].content, data[0].time, '', 'https://www.cc98.org/pic/anonymous.gif', hitCount, null);
    }


    return topicMessage;
}
export async function getTopicContent(topicid: number, curPage: number) {
    const startPage = (curPage - 1) * 10;
    const endPage = curPage * 10 - 1;
    let token = getLocalStorage("accessToken");
    const topic = curPage !== 1
        ? await fetch(`http://apitest.niconi.cc/Post/Topic/${topicid}?from=${startPage}&size=10`, { headers: { 'Authorization': token } })
        : await fetch(`http://apitest.niconi.cc/Post/Topic/${topicid}?from=1&size=9`, { headers: { 'Authorization': token } });

    const replyCountResponse = await fetch(`http://apitest.niconi.cc/Topic/${topicid}`, { headers: { 'Authorization': token } });
    const replyCountJson = await replyCountResponse.json();
    const replyCount = replyCountJson.replyCount;
    const content = await topic.json();
    const post: State.ContentState[] = [];
    let topicNumberInPage: number;
    if (curPage !== 1 && curPage * 10 <= replyCount) {
        topicNumberInPage = 10;
    } else if (curPage === 1 && replyCount >= 9) {
        topicNumberInPage = 9;
    } else if (curPage === 1 && replyCount < 9) {
        topicNumberInPage = replyCount;
    } else {
        topicNumberInPage = (replyCount - (curPage - 1) * 10 + 1);
    }
    for (let i = 0; i < topicNumberInPage; i++) {
        if (content[i].userName != null) {

            const userMesResponse = await fetch(`http://apitest.niconi.cc/user/name/${content[i].userName}`);
            const userMesJson = await userMesResponse.json();
            post[i] = new State.ContentState(content[i].id, content[i].content, content[i].time, content[i].isDeleted, content[i].floor, content[i].isAnonymous, content[i].lastUpdateAuthor, content[i].lastUpdateTime, content[i].topicId, content[i].userName, userMesJson.postCount, userMesJson.portraitUrl, userMesJson.signatureCode, content[i].userId, userMesJson.privilege);
        } else {
            let purl = 'https://www.cc98.org/pic/anonymous.gif';
            post[i] = new State.ContentState(null, content[i].content, content[i].time, content[i].isDeleted, content[i].floor, content[i].isAnonymous, null, content[i].lastUpdateTime, content[i].topicId, '匿名', null, purl, '', null,"匿名用户");
        }
    }
    return post;
}
export function convertHotTopic(item: State.TopicTitleAndContentState) {
    return <TopicTitleAndContent title={item.title} authorName={item.userName} id={item.id} authorId={item.userId} lastPostTime={item.lastPostTime} lastPostUserName={item.lastPostUser} />
        ;
}
export function getPager(curPage, totalPage) {
    if (curPage == undefined) {
        curPage = 1;
    }
    let pages: number[] = [];
    if (totalPage == 1) {
        pages = [1];
    } else if (totalPage < 10 && totalPage > 1) {
        if (curPage == undefined || curPage == 1) {
            let i;
            for (i = 0; i < totalPage; i++) {
                pages[i] = i + 1;
            }
            pages[i] = -2;
            pages[i + 1] = -4;
        } else if (curPage == 2) {
            let i;
            for (i = 1; i <= totalPage; i++) {
                pages[i] = i;
            }
            pages[0] = -1;
            pages[i] = -2;
            pages[i + 1] = -4;
        } else {
            let i;
            for (i = 2; i <= totalPage + 1; i++) {
                pages[i] = i - 1;
            }
            pages[0] = -3;
            pages[1] = -1;
            pages[i] = -2;
            pages[i + 1] = -4;
        }
    } else {
        if (curPage + 5 <= totalPage) {
            if (curPage == undefined || curPage == 1) {
                pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, - 2, -4];
            } else if (curPage > 1 && curPage < 6) {
                pages = [-3, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, - 2, -4];
            } else {
                pages = [-3, -1, curPage - 4, curPage - 3, curPage - 2, curPage - 1, curPage, curPage + 1, curPage + 2, curPage + 3, curPage + 4, curPage + 5, - 2, -4];
            }
        } else if (curPage + 5 > totalPage && curPage != totalPage) {
            return [-3, -1, totalPage - 9, totalPage - 8, totalPage - 7, totalPage - 6, totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage, -2, -4];
        } else if (curPage == totalPage) {
            return [-3, -1, totalPage - 9, totalPage - 8, totalPage - 7, totalPage - 6, totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
        }
    }
    return pages;
}
export async function getCurUserTopic(topicid: number, userId: number) {
    let token = getLocalStorage("accessToken");
    const response = await fetch(`http://apitest.niconi.cc/post/Topic/user?topicid=${topicid}&userid=${userId}&from=0&size=1`, { headers: { 'Authorization': token } });
    const data = await response.json();
    const userMesResponse = await fetch(`http://apitest.niconi.cc/user/name/${data[0].userName}`);
    const userMesJson = await userMesResponse.json();
    data[0].userImgUrl = userMesJson.portraitUrl;
    return data[0];
}
export async function getCurUserTopicContent(topicid: number, curPage: number, userName: string, userId: number) {
    const topicMessage = await getTopic(topicid);
    let start: number;
    let isUserPoster: boolean;
    if (topicMessage.userName === userName) {
        isUserPoster = true;
        if(curPage===1)
             start = (curPage - 1) * 10 + 1;
        else
             start = (curPage - 1) * 10;
    } else {
        isUserPoster = false;
             start = (curPage - 1) * 10;
    }

    const token = getLocalStorage("accessToken");
    const topic = await fetch(`http://apitest.niconi.cc/Post/Topic/user?topicid=${topicid}&userId=${userId}&from=${start}&size=10`, { headers: { 'Authorization': token } });
    const content = await topic.json();


    let post: State.ContentState[] = [];
    let topicNumberInPage: number;
    const replyCount = content[0].count;

    if (curPage !== 1 && curPage * 10 <= replyCount) {
        topicNumberInPage = 10;
    } else if (curPage === 1 && replyCount >= 9 && isUserPoster == true) {
        topicNumberInPage = 9;
    } else if (curPage === 1 && replyCount >= 9 && isUserPoster == false) {
        topicNumberInPage = 10;
    } else if (curPage === 1 && replyCount < 9) {
        topicNumberInPage = replyCount;
    } else {
        topicNumberInPage = (replyCount - (curPage - 1) * 10);
    }

    for (let i = 0; i < topicNumberInPage; i++) {
        if (content[i].userName != null) {
            const userMesResponse = await fetch(`http://apitest.niconi.cc/user/name/${content[i].userName}`);
            const userMesJson = await userMesResponse.json();

            post[i] = new State.ContentState(content[i].id, content[i].content, content[i].time, content[i].isDeleted, content[i].floor, content[i].isAnonymous, content[i].lastUpdateAuthor, content[i].lastUpdateTime, content[i].topicId, content[i].userName, userMesJson.postCount, userMesJson.portraitUrl, userMesJson.signatureCode, content[i].userId,userMesJson.privilege);

        } else {
            let purl = 'https://www.cc98.org/pic/anonymous.gif';
            post[i] = new State.ContentState(null, content[i].content, content[i].time, content[i].isDeleted, content[i].floor, content[i].isAnonymous, null, content[i].lastUpdateTime, content[i].topicId, '匿名', null, purl, '', null,"匿名用户");
        }
    }

    return post;
}
export function sendRequest() {
    //申请到的appID
    const appId = '89084063-b0b2-45a3-87c5-a19db2ac3038';
    //申请后的回调地址
    const c = 'http://localhost:58187/messagebox/message';
    const redirectUri = encodeURI(c);
    //构造请求，请求网址为授权地址，响应类型为token，请求所有操作信息根据98api为all，重定向地址即为回调地址
    const path = 'https://login.cc98.org/OAuth/Authorize?';
    const queryParams = [`client_id=${appId}`, 'response_type=token', 'scope=all', `redirect_uri=${redirectUri}`];
    const query = queryParams.join('&');
    const url = path + query;
    return url;
}

export function systemRequest() {
    //申请到的appID
    const appId = '89084063-b0b2-45a3-87c5-a19db2ac3038';
    //申请后的回调地址
    const c = 'http://localhost:58187/messagebox/system';
    const redirectUri = encodeURI(c);
    //构造请求，请求网址为授权地址，响应类型为token，请求所有操作信息根据98api为all，重定向地址即为回调地址
    const path = 'https://login.cc98.org/OAuth/Authorize?';
    const queryParams = [`client_id=${appId}`, 'response_type=token', 'scope=all', `redirect_uri=${redirectUri}`];
    const query = queryParams.join('&');
    const url = path + query;
    return url;
}

export function responseRequest() {
    //申请到的appID
    const appId = '89084063-b0b2-45a3-87c5-a19db2ac3038';
    //申请后的回调地址
    const c = 'http://localhost:58187/messagebox/response';
    const redirectUri = encodeURI(c);
    //构造请求，请求网址为授权地址，响应类型为token，请求所有操作信息根据98api为all，重定向地址即为回调地址
    const path = 'https://login.cc98.org/OAuth/Authorize?';
    const queryParams = [`client_id=${appId}`, 'response_type=token', 'scope=all', `redirect_uri=${redirectUri}`];
    const query = queryParams.join('&');
    const url = path + query;
    return url;
}
export function changeNav(id) {
    $('.mymessage-nav > div').removeClass('mymessage-nav-focus');
    $(id).addClass('mymessage-nav-focus');
}
/**
 * 获取全站新帖
 * @param curPage
 */
export async function getAllNewTopic(curPage: number) {
    /**
     * 一次性可以获取20个主题
     */
    const startPage: number = (curPage - 1) * 20 + 1;
    const size = 20;
    let token = getLocalStorage("accessToken");
    /**
     * 通过api获取到主题之后转成json格式，但此时没有作者头像的图片地址和版面名称
     */
    const newTopics0 = await fetch(`http://apitest.niconi.cc/Topic/New?from=${startPage}&size=${size}`, { headers: { 'Authorization': token } });
    const newTopics1 = await newTopics0.json();
    console.log(newTopics1);
    for (let i in newTopics1) {
        /**
        *根据作者名字获取作者头像的图片地址
        */

        if (newTopics1[i].userName == null) {
            newTopics1[i].userName = '匿名';
            newTopics1[i].portraitUrl = 'https://www.cc98.org/pic/anonymous.gif';
        }
        else {
            const userInfo0 = await fetch(`http://apitest.niconi.cc/User/${newTopics1[i].userId}`);
            const userInfo1 = await userInfo0.json();
            newTopics1[i].portraitUrl = userInfo1.portraitUrl;
            const userFan0 = await fetch(`http://apitest.niconi.cc/User/Follow/FanCount?userid=${newTopics1[i].userId}`);
            const userFan1 = await userFan0.json();
            newTopics1[i].fanCount = userFan1;
        }
        /**
         * 根据版面id获取版面名称
         */
        const boardInfo0 = await fetch(`http://apitest.niconi.cc/Board/${newTopics1[i].boardId}`);
        const boardInfo1 = await boardInfo0.json();
        newTopics1[i].boardName = boardInfo1.name;
    }
    /**
     * 将补充完善的数据赋值给newTopics，以便后续进行可视化
     */
    //const newTopics: FocusPost[] = newTopics1;
    return newTopics1;
}
export function setStorage(key, value) {
    let v = value;
    if (typeof v == 'object') {
        v = JSON.stringify(v);
        v = `obj-${v}`;
    } else {
        v = `str-${v}`;
    }
    sessionStorage.setItem(key, v);
}
export function getStorage(key) {
    let v = sessionStorage.getItem(key);
    if (!v) {
        return;
    }
    if (v.indexOf('obj-') === 0) {
        v = v.slice(4);
        return JSON.parse(v);
    } else if (v.indexOf('str-') === 0) {
        return v.slice(4);
    }
}
export function setLocalStorage(key, value) {
    let v = value;
    if (typeof v == 'object') {
        v = JSON.stringify(v);
        v = `obj-${v}`;
    } else {
        v = `str-${v}`;
    }
    localStorage.setItem(key, v);
}
export function getLocalStorage(key) {
    let v = localStorage.getItem(key);
    if (!v) {
        return;
    }
    if (v.indexOf('obj-') === 0) {
        v = v.slice(4);
        return JSON.parse(v);
    } else if (v.indexOf('str-') === 0) {
        return v.slice(4);
    }
}
export function removeLocalStorage(key) {
    localStorage.removeItem(key);
    return;
}
export function removeStorage(key) {
    sessionStorage.removeItem(key);
    return;
}