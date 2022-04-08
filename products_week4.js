import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";
import pagination from "./pagination.js";  //inport都放最上面

const site = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'david-frontend'; 
//新增、編輯用的productModal
let productModal = {};
//刪除用的delProductModal
let delProductModal = {};

const app = createApp({
    //新增一個components來放區域註冊
    components:{
        pagination
    },
    data(){
        return{
           products: [],
           tempProduct: {
               imagesUrl: [],
           },
           isNew: false, 
           pagination: {},  
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
        getProducts(page = 1){ //使用參數預設值
            //query
            const url = `${site}api/${api_path}/admin/products/?page=${page}`; 
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;  
                    this.pagination = res.data.pagination; //把外部傳來的資料放入自己的products中
                }).catch(err=>{
                    // 顯示錯誤
                    console.dir(err);
                    alert(err.data.message);
                })
        },
        openModal(status, product){
            console.log(status, product);//小步測試
            if (status === 'isNew'){   // 新增產品
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show(); 
                this.isNew = true; 
            }else if(status === 'edit'){   // 編輯產品
                this.tempProduct = {...product}; 
                if(this.tempProduct.imagesUrl){
                    this.isNew = false;
                    productModal.show();
                }
                else{
                    this.tempProduct.imagesUrl=[];
                    this.isNew = false;
                    productModal.show(); 
                } 
            }else if(status === 'delete'){   // 刪除產品
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
    },
    mounted(){
		this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false 
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false  
        });
    }
});

//全域註冊

//新增、編輯
//自定一個註冊名稱
app.component('productModal', {
    //使用props方法接受外層資料
    //props裡面是放自定的接收名稱
    props: ['tempProduct', 'isNew'],    //要記得加上isNew，如果沒有把 isNew 傳入 products_week4.js，會抓不到isNew
    template: `#templateForProductModal`,
    //新建一個方法區放方法
    methods:{
        //新增、編輯
        updateProduct(){
            let url = `${site}api/${api_path}/admin/product`; 
            let method = 'post';                                                 
            if (!this.isNew){
                console.log(this.tempProduct);
                url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;  
                method = 'put';                                                        
            }
            axios[method](url, {data: this.tempProduct})
                .then(res => {
                    //this.getProducts();   沒有getProducts(那是外層的方法)
                    //改成使用emit來觸發外層事件
                    //emit裡面是放自定的傳送名稱
                    this.$emit('get-products');
                    productModal.hide(); 
                })
                // catch回傳失敗的訊息
                .catch(function (error) {
                    console.log(error);
                });
        },
    }
})

//刪除
// 自定一個註冊名稱
app.component('delProductModal',{
    //自定的接收名稱
    props:['tempProduct'], 
    template:`#templateForDelProductModal`,  //x-template的id
    //創立一個方法集
    methods:{
        //刪除產品的方法
        delProduct(){
            let url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;  
            
            axios.delete(url)
                .then(res => {
                    //this.getProducts();   內層沒有getProducts，要用emit
                    this.$emit('get-products');  //這是自定的傳送名稱
                    delProductModal.hide(); 
                })
        },
    }
})


app.mount('#app');
