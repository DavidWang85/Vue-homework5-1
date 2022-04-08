import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";

const site = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'david-frontend'; 

const app = createApp({
    data(){
        return{
           products: [],
           tempProducts: {},
        }
    },
    methods: {
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)davidToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            console.log(token);

            const url = `${site}api/user/check`;
            axios.post(url)
                .then( () => {
                    this.getProducts(); 
                })
                .catch( () => {
                    window.location = './login.html';
                })
        },
        getProducts(){
            const url = `${site}api/${api_path}/admin/products/all`; 
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;  //把外部傳來的資料放入自己的products中
                })
        }
    },
    mounted(){
		this.checkLogin();
    }
});
app.mount('#app');