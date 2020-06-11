import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-ada4d.firebaseio.com/'
});

export default instance;