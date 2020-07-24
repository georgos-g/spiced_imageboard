new Vue({
    el: '#main',
    data: {
        title: "",
        username: "",
        description: "",
        file: "",
        
        
        images: [],

    },

    methods: {

        fileChanged: function (event) {
            this.file = event.target.files[0];
        },

        uploadImage: function (event) {
            event.preventDefault();

            const myData = new FormData();
            myData.append('title', this.title);
            myData.append('username', this.username);
            myData.append('description', this.description);
            myData.append('file', this.file);
            
            
            axios.post('/upload', myData).then(response => {
                this.images.unshift({
                    title: this.title,
                    url: response.data.fileURL
                });

                this.title = '';
                this.username = '';
                this.description = '';
                this.file = '';
                
                
            });
        }
            
    },
    mounted() {
        axios.get('api/v1/images').then((responce) => {
            this.images = responce.data;
        });
    },

});