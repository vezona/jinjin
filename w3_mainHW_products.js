let productModal, delProductModal;

const product = {
    data() {
        return {
            apiURL: 'https://vue3-course-api.hexschool.io/api',
            apiPath: 'ffjjgogogo',
            products: '',
            modalInnerText: '金金',
            isNewTitle: true,
            tempProduct: { //這個是要放v-for跑出的單筆資料(product)
                imagesUrl: [], //因為下面只用淺拷貝，所以這邊的img陣列就要另外寫 (否則會影響到，因為只拷貝一層)
            },

        }

    },
    created() {
        // 先取token，看看有沒有token登入狀態
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hextoken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (!token) {
            alert('請先登入')
            window.location = './w3_mainHW_login.html';
        }

        // 用axios預設值的方式將token帶入axios的header中，這點很重要，因為之後發送編輯刪除的請求也都要同時發送驗證的token
        axios.defaults.headers.common.Authorization = token;

        // 在created的階段先取資料
        this.getData()
    },
    mounted() {
        //掛載BS，元件掛載後才取得到DOM元素
        // 去建立BS實體才有辦法掛載data元件
        const newProductModal = document.querySelector('#productModal');
        productModal = new bootstrap.Modal(newProductModal)

        const delProduct = document.querySelector('#delProductModal');
        delProductModal = new bootstrap.Modal(delProduct)
    },
    methods: {
        getData() {
            // 可以把axios變成方法放在這邊，再到created/mounted時呼叫
            const getProductURL = `${this.apiURL}/${this.apiPath}/admin/products?page=1`;
            // 這邊要修改，改成admin/products要驗證的api
            axios.get(getProductURL)
                .then(res => {
                    console.log(res)
                    if (res.data.success == true) {
                        this.products = res.data.products
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(error => {
                    alert(error)
                })
        },
        // 編輯跟新增共用一個Modal
        openModal(isNew, item) {
            if (isNew === 'new') {
                productModal.show()
                this.tempProduct = {} //先把tempProduct物件清空，才不會把編輯的東西也帶上來
                // 因為modal綁定tempProduct內的值
                this.isNewTitle = true; //使用自定義的isNew來決定modal title是新建或編輯
            } else if (isNew === 'edit') {
                productModal.show()
                this.isNewTitle = false;

                //這邊是用解構的方式，把v-for迴圈跑出來的單筆product，用淺層拷貝的方式
                //複製一份到tempProduct上，再將tempProduct帶回modal的input內
                this.tempProduct = {
                    ...item
                }
                // console.log(item) //把for迴圈產生的item放進來跑，就能指定點擊的是哪項產品
            } else if (isNew === 'delete') {
                delProductModal.show()
                this.tempProduct = {
                    ...item
                }
            }
        },
        updateProduct() {
            // 先設定共用參數
            let editProductURL = `${this.apiURL}/${this.apiPath}/admin/product/`;
            let http = 'post';

            // 修改商品 [API]: /api/:api_path/admin/product/:id ；PUT
            if (this.isNew != 'new') {
                editProductURL = `${this.apiURL}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = "put"
            }

            // 新建商品  [API]: /api/:api_path/admin/product ； POST
            // axios 的post 跟put 需要傳入data資料，才知道誰是tempProduct
            axios[http](editProductURL, {
                    data: this.tempProduct
                })
                .then(res => {
                    console.log(res)
                    if (res.data.success) {
                        productModal.hide()
                        alert(res.data.message)
                        this.getData(); //還要再重新渲染一次頁面
                    } else {
                        alert(res.data.message)
                    }
                })
        },
        delProduct() {
            const delProductURL = `${this.apiURL}/${this.apiPath}/admin/product/${this.tempProduct.id}`;;

            axios.delete(delProductURL)
                .then(res => {
                    console.log('del', res)
                    if (res.data.success == true) {
                        delProductModal.hide();
                        alert(res.data.message)
                        this.getData(); //還要再重新渲染一次頁面
                    } else {
                        alert(response.data.message);
                    }
                })

        },
        addImg() {
            this.tempProduct.imagesUrl = []
        }

    }
};

Vue.createApp(product).mount('#app');