import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";

const site = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'david-frontend'; 
//在外層定義新增、編輯用的productModal
let productModal = {};
//在外層定義刪除用的delProductModal
let delProductModal = {};

const app = createApp({
    data(){
        return{
           products: [],
           tempProduct: {
               imagesUrl: [],
           },
           isNew: false, //新增一個變數isNew，判斷新增方法或編輯方法
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
                    this.products = res.data.products;  //把外部伺服器傳來的資料放入自己的products中
                })
        },
        //參數statue代表帶入的狀態
        //參數product代表有無帶入產品
        openModal(status, product){
            console.log(status, product);//小步測試
            //如果是新增產品跑這段
            if (status === 'isNew'){
                //重置tempProduct，以免其他地方出錯
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show(); //打開modal
                this.isNew = true; //如果狀態是isNew我們在data.isNew判斷為true
            }else if(status === 'edit'){   //如果是編輯產品跑這段
                this.tempProduct = {...product}; //使用淺拷貝解決傳參考的問題
                if(this.tempProduct.imagesUrl){
                    this.isNew = false;
                    productModal.show();
                }
                else{
                    this.tempProduct.imagesUrl=[];
                    this.isNew = false; //如果狀態不是isNew我們在data.isNew判斷為false
                    productModal.show(); //打開modal 
                } 
            }else if(status === 'delete'){  //如果是刪除產品跑這段
                this.tempProduct = {...product};
                if(this.tempProduct.imagesUrl){
                    delProductModal.show();
                }
                else{
                    this.tempProduct.imagesUrl=[];
                    delProductModal.show(); 
                } 
            }
        },
        //建立新增產品方法
        //從addProducts改名為updateProduct讓他可以新增和編輯產品
        updateProduct(){
            //以新增方法當作預設
            //如果data.isNew裡面的布林值是ture時
            let url = `${site}api/${api_path}/admin/product`;  //新增功能的API
            let method = 'post';                                                      //新增功能的遠端傳送方法

            //如果data.isNew裡面的布林值不是ture時(編輯)
            if (!this.isNew){
                url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;   //編輯功能的API
                method = 'put';                                                        //編輯功能的遠端傳送方法
    
            }
            //使用中括號帶變數來切換
            axios[method](url, {data: this.tempProduct})
                .then(res => {
                    this.getProducts(); //1.因為伺服器更新的本地端卻還沒，所以重新取得產品列表
                    productModal.hide(); //2.使用完把modal關起來
                })
        },
        //建立刪除產品的方法
        delProduct(){
            let url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;  //新增功能的API
            
            axios.delete(url)
                .then(res => {
                    this.getProducts(); //1.所以重新取得產品列表
                    delProductModal.hide(); //2.使用完把modal關起來
                })
        }
    },
    mounted(){
		this.checkLogin();
        //BS官網直接複製
        //綁定好dom元素
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false  //表示是否能用鍵盤操作 使用false比較不會誤觸
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false  //表示是否能用鍵盤操作 使用false比較不會誤觸
        });
    }
});
app.mount('#app');
