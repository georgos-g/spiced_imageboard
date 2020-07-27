new Vue({
    el: '#main',
    data: {// data from the html upload form 
        title: "",
        username: "",
        description: "",
        file: "",
        
        
        images: [],
        selectedImage: false

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
    mounted: function() {//when vue.js is loaded function starts
        axios.get('api/v1/images').then((response) => {
            this.images = response.data;
        });
    },

});

//COMPONENT

Vue.component('img-overlay', {
    template: '#template-img-overlay',
    probs: ['title', 'description', 'imageURL', 'comments'],
    data: function () {
        return {
            title: ''
            description: ''
            imageURL: ''
            comments: ''
        }
    },

    mounted: function() {//img overlay
        axios.get('api/v1/images/overlay' +this.id).then((response) => {
            this.title = imageInfo.title;
            this.title = imageInfo.description;
            this.title = imageInfo.imageURL;
            this.title = imageInfo.comments;
          

        });
    },

    methods: {
        closeSign: function() {
            console.log("close the overlay");
            this.$emit('close');
        }
    },
    

});
