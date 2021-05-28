const app = {
    data() {
        return {
            email: '',
            password: '',

        }
    },
    methods: {
        sendData(e) {
            e.preventDefault()

            const url = "https://vue3-course-api.hexschool.io";
            const apiPath = "ffjjgogogo";
            const user = {
                username: this.email,
                password: this.password
            }
            console.log(user)
            // console.log(`${url}/admin/signin`)
            axios.post(`${url}/admin/signin`, user)
                .then(res => {
                    console.log(res)
                    if (res.data.message == "登入成功") {
                        const token = res.data.token,
                            expired = res.data.expired
                        console.log(token, expired)
                        document.cookie = `hextoken=${token};expired=${new Date(expired)}`
                        // 轉址
                        window.location = './w3_mainHW_products.html'
                    } else {
                        alert(res.data.message)
                    }
                }).catch(error => {
                    console.log(error)
                })
        }



    }
}

Vue.createApp(app).mount('#app');