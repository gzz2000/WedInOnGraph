import axios from 'axios';
import { message } from 'antd';
import { forceClearAuth } from './context_auth';

const sendPostRequest = async (url, params) => {
  console.log(url, params)
  let ret;
  try {
    ret = (await axios.post('/api' + url, params)).data;
  }
  catch(e) {
    message.error(e.toString());
    throw e;
  }
  if(ret['success']) return ret['data'];
  else {
    message.error(ret['err']);
    if(ret['relogin']) {
      return await new Promise((res, rej) => {
        setTimeout(() => {
          forceClearAuth();
          window.location.reload();
          rej(ret['err']);
        }, 1000);
      })
    }
    throw ret['err'];
  }
};

const login = async params => {
  return await sendPostRequest('/login', params);
};

const register = async params => {
  return await sendPostRequest('/register', params);
};

const list_followed_posts = async (limit, offset, user) => {
  return await sendPostRequest('/list_followed_posts', {
    limit, offset, token: user.token
  });
};

const list_all_posts = async (limit, offset) => {
  return await sendPostRequest('/list_all_posts', {
    limit, offset
  });
};

const add_post = async (post, user) => {
  return await sendPostRequest('/add_post', {
    post,
    token: user.token
  });
};

const delete_post = async (postid, user) => {
  return await sendPostRequest('/delete_post', {
    postid,
    token: user.token
  });
};

const set_follow = async (other, user) => {
  return await sendPostRequest('/set_follow', {
    other,
    token: user.token
  });
};

const set_unfollow = async (other, user) => {
  return await sendPostRequest('/set_unfollow', {
    other,
    token: user.token
  });
};

const add_thumbup = async (postid, user) => {
  return await sendPostRequest('/add_thumbup', {
    postid,
    token: user.token
  });
};

const remove_thumbup = async (postid, user) => {
  return await sendPostRequest('/remove_thumbup', {
    postid,
    token: user.token
  });
};

const search_user = async (keyword, user, limit, offset) => {
  return await sendPostRequest('/search_user', {
    keyword, limit, offset,
    ...(user === null ? {} : {token: user.token})
  });
};

const recommend_2_hop = async (me, limit) => {
  return await sendPostRequest('/recommend_2_hop', {
    me, limit
  });
};

export default { login, register, list_followed_posts, list_all_posts, add_post, delete_post, set_follow, set_unfollow, add_thumbup, remove_thumbup, search_user, recommend_2_hop };

/* class Service {
 *   login(values) {
 *     console.log(values)
 *     return axios.post("/api/login", values)
 *       .then(res => {
 *         console.log(res.data);
 *         sessionStorage.setItem("user", JSON.stringify(res.data));
 *         return res.data;
 *       });
 *   }
 *   Logout() {
 *     sessionStorage.removeItem("user");
 *   }
 *   Register(values) {
 *     return axios.post("register", values);
 *   }
 *   EditInfo(values) {
 *     return axios.post("editInfo", values);
 *   }
 * 
 *   getCurrentUser() {
 *     return JSON.parse(sessionStorage.getItem('user'));
 *   }
 *   async getUserEmail(usr) {
 *     console.log(usr);
 *     const ret = await axios.get("getUserEmail?username="+usr);
 *     return JSON.stringify(ret.data);
 *   }
 *   async getFollowed(usr) {
 *     const ret = await axios.get("getFollowed?username="+usr);
 *     return JSON.stringify(ret.data);
 *   }
 *   async getFollower(usr) {
 *     const ret = await axios.get("getFollower?username="+usr);
 *     return JSON.stringify(ret.data);
 *   }
 *   async getPosts(usr) {
 *     return axios.get("getPosts?username="+usr);
 *   }
 *   async get2HopUnfollow(usr) {
 *     return axios.get("get2HopUnfollow?username="+usr);
 *   }
 *   async exploreUser(usr) {
 *     return axios.get("exploreUser?username="+usr);
 *   }
 * 
 *   addPost(user, contents) {
 *     return axios.post("addPost", {username:user, post:contents});
 *   }
 *   delPost(user, postid) {
 *     return axios.post("delPost", {username:user, postid:postid});
 *   }
 * 
 *   setFollow(me, other) {
 *     return axios.post("setFollow", {me:me, other:other});
 *   }
 *   setunFollow(me, other) {
 *     return axios.post("setunFollow", {me:me, other:other});
 *   }
 * } */

// export default new Service();
