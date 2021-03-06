new Vue({
    el: '#main',
    data: {
    // data from the html upload form
        title: '',
        username: '',
        description: '',
        file: '',
        showButton: 'true',

        images: [],
        selectedImageId: false,
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

            axios.post('/upload', myData).then((response) => {
                this.images.unshift({
                    title: this.title,
                    url: response.data.fileURL,
                });

                this.title = '';
                this.username = '';
                this.description = '';
                this.file = '';
            });
        },

        loadmore: function () {
            const lastImage = this.images[this.images.length - 1];

            axios.get('/api/v1/images/' + lastImage.id).then((response) => {
                for (let image of response.data) {
                    this.images.push(image);
                }
                if (response.data.length < 4) {
                    this.showButton = false;
                }
            });
        },
    },

    mounted: function () {
    //when all necessary data are loaded function starts
        axios.get('api/v1/images/0').then((response) => {
            this.images = response.data;
        });
        addEventListener('hashchange', () => {
            this.selectedImageId = window.location.hash.replace('#', '');
        });
    },
});

//COMPONENT

Vue.component('img-overlay', {
    template: '#template-img-overlay',
    props: ['id'],
    data: function () {
        return {
            title: '',
            description: '',
            imageURL: '',

            comments: [],

            comment_username: '',
            comment_description: '',
        };
    },

    methods: {
        closeSign: function () {
            this.$emit('close');
            history.pushState(false, false, '#');
        },

        loadImage: function () {
            //loadImage on modal
            axios.get('api/v1/image/' + this.id).then((response) => {
                this.title = response.data.title;
                this.description = response.data.description;
                this.imageURL = response.data.url;
            });
        },

        loadComments: function () {
            //load img comments
            axios.get('api/v1/comments-for-image/' + this.id).then((response) => {
                if (response.data) {
                    this.comments = response.data;
                } else {
                    console.log('Please type your comment :-)');
                }
            });
        },

        sendComment: function () {
            const myData = new FormData();
            myData.append('username', this.comment_username);
            myData.append('description', this.comment_description);
            myData.append('image_id', this.id);

            axios
                .post('api/v1/comments-for-image-create', myData)
                .then((response) => {
                    if (response.status == 200) {
                        this.comments.push(response.data);
                        this.comment_description = '';
                    }
                });
        },
    },
    mounted: function () {
        this.loadImage();
        this.loadComments();
    },
    watch: {
        id: function () {
            this.loadImage();
            this.loadComments();
        },
    },
});
