const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'david-frontend';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

//載入JSON檔案的(中文驗證資訊)
//宣告
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({ // 用來做一些設定
    generateMessage: localize('zh_TW'), //啟用 locale
});

const app = Vue.createApp({
    data(){
        return {
            cartData: {
                carts: []
            }, //購物車
            products: [], //產品
            productId: '', //產品id
            isLoadingItem: '',
            isLoading: false,
            fullPage: true,
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
              },
        }
    },
    methods: {
        getProducts(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res => {
                    this.products = res.data.products;
                })
        },
        openProductModal(id){
            this.productId = id;
            setTimeout( ()=> {
                this.$refs.productModal.openModal();
            }, 700);
        },
        getCart(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    this.cartData = res.data.data;
                })
        },
        addToCart(id, qty=1){
            const data = {
                product_id: id,
                qty,
            };
            this.isLoadingItem = id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`, {data})
                .then(res => {
                    this.alertAddToCart(res.data.data.product.title);
                    console.log('購物車',res);
                    this.getCart();
                    this.$refs.productModal.closeModal();
                    this.isLoadingItem = '';
                })
        },
        removeCartItem(id,name){
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`) 
                .then(res => {
                    this.alertRemoveCartItem(name);
                    console.log('刪除購物車',res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
        },
        removeAllCart(){
            axios.delete(`${apiUrl}/api/${apiPath}/carts`) 
                .then(res => {
                    console.log('刪除全部購物車', res);
                    this.alertRemoveAllCart();
                    this.getCart();
                })
        },
        updateCartItem(item){
            const data = {
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {data})
                .then(res => {
                    console.log('put購物車',res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
        },
        createOrder(){
            const order = this.form;
            axios.post(`${apiUrl}/api/${apiPath}/order`, {data: order})  
                .then((res) => {
                    this.alertCreateOrder();
                    console.log('post結帳', res);
                    this.$refs.form.resetForm();
                    this.getCart();
                }).catch((err) =>{
                    alert(err.data.message);
                });
        },
        alertAddToCart(name) {
            //加入購物車顯示
            Swal.fire({
                toast: true,  //啟用吐司框
                title: `商品 ${name} <br>已成功加入購物車`,
                position: 'top-end', //位置
                timer: 2000,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "success"
            });
        },
        alertRemoveAllCart() {
            Swal.fire({
                toast: true,  //啟用吐司框
                title: "購物車已清空",
                position: 'top-end', //位置
                timer: 2000,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "info"
            });
        },
        alertRemoveCartItem(name) {
            Swal.fire({
                toast: true,  //啟用吐司框
                title: `商品 ${name} 以刪除`,
                position: 'top-end', //位置
                timer: 1500,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "info"
            });
        },
        alertCreateOrder(){
            Swal.fire({
                title: "訂單建立完成",
                text: "期待與你/妳的相遇",
                showConfirmButton: true,
                // color: "#663224",
                icon: "success",
                confirmButtonColor: "#008000",
            }); 
        },
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    mounted(){
        this.getProducts();
        this.getCart();
        this.isLoading = true;
        setTimeout(() => {
        // 3 秒後結束 loading
        this.isLoading = false;
      },3000);
    }
})
//全域註冊
app.component('product-modal', {
    props: ['id'],
    template:`#userProductModal`,
    data(){
        return{
            modal: {},
            product: {},
            qty: 1,
        }
    },
    watch:{
        id(){
            this.getProduct();
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        getProduct(){
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    this.product = res.data.product;
                })
        },
        addToCart(){
            this.$emit('add-cart', this.product.id, this.qty);
        },
        closeModal(){
            this.modal.hide();
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
});
app.component('loading', VueLoading.Component);
app.mount('#app');
