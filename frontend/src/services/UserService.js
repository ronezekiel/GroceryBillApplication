import axios from 'axios';

const USER_BASE_API_URL = "http://localhost:8080/api/user";

class UserService {

    userLogin(username,password){
        return axios.get(USER_BASE_API_URL + "/auth/" + username +"/"+password);
    }
    userSignup(user) {
        return axios.post(USER_BASE_API_URL + "/signup", user);
    }
    userSignupUsername(username){
        return axios.get(USER_BASE_API_URL + "/auth/" +username)
    }
}
export default new UserService()