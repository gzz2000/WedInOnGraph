import { resolveOnChange } from "antd/es/input/Input";
import axios from "axios";

class Service {
  Login(values) {
    console.log(values)
    return axios.post("login", values)
      .then(res => {
        console.log(res.data);
        sessionStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      });
  }
  Logout() {
    sessionStorage.removeItem("user");
  }
  Register(values) {
    return axios.post("register", values);
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
  }
  async getUserEmail(usr) {
    console.log(usr);
    const ret = await axios.get("getUserEmail?username="+usr);
    return JSON.stringify(ret.data);
  }
  async getFollowed(usr) {
    const ret = await axios.get("getFollowed?username="+usr);
    return JSON.stringify(ret.data);
  }
  async getFollower(usr) {
    const ret = await axios.get("getFollower?username="+usr);
    return JSON.stringify(ret.data);
  }
  async getPosts(usr) {
    return axios.get("getPosts?username="+usr);
  }

  addPost(user, contents) {
    return axios.post("addPost", {username:user, post:contents});
  }
  delPost(values) {
    return axios.post("delPost", values);
  }
}

export default new Service();