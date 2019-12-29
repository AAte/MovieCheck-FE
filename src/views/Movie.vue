<template>

    <div v-if="movie" v-bind:class="movie" class="text-center">
        <div v-if="movie.imdbID.length !== 0" class="row">
            <div class="col-4 p-4">
                <hr>
            </div>
            <div class="col-4">
                <h1 class="p-4 font-weight-bold" style="color: cornflowerblue">{{movie.Title}}</h1>
            </div>
            <div class="col-4 p-4">
                <hr>
            </div>
        </div>

        <div class="container">
            <div class="row">

                <div class="col-sm col-3">
                    <img height="600px" v-bind:src="movie.Poster">
                </div>

                <div class="col-sm text-left align-text-bottom">
                    <h2 class="text-center">Movie info</h2>
                    <div><span class="font-weight-bold">Release date:</span> {{movie.Released}}</div>
                    <div><span class="font-weight-bold">Age restriction:</span> {{movie.Rated}}</div>
                    <div><span class="font-weight-bold">Movie length:</span> {{movie.Runtime}}</div>
                    <div><span class="font-weight-bold">Movie Genre:</span> {{movie.Genre}}</div>
                    <div><span class="font-weight-bold">Movie Language:</span> {{movie.Language}}</div>
                    <div><span class="font-weight-bold">Movie Country:</span> {{movie.Country}}</div>
                    <div><span class="font-weight-bold">Movie Awards:</span> {{movie.Awards}}</div>

                    <button class="btn border-primary mt-3" v-on:click="addToFavorites(movie.imdbID)" >Add to favorites</button>

                    <div class="form-group mt-4 shadow p-4 mb-4 bg-white rounded">
                        <label class="font-weight-bold" for="comment">Leave a comment:</label>
                        <textarea class="form-control" rows="5" id="comment" v-model="comment" v-on:change="checkForm" placeholder="How do you like this movie?"></textarea>
                        <div class="row  mt-2">
                            <div class="col-5">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend float-left">
                                        <span class="input-group-text">Rating
                                         <icon name="star" width="20px" height="20px" class="checked"></icon>
                                        </span>
                                    </div>
                                    <input type="number" id="rating" v-model="rating" v-on:change="checkForm" step="1" class="form-control">
                                </div>
                            </div>

                            <div class="col-4 pt-2">(1 to 10)</div>

                            <div class="col-3">
                                <button class="btn btn-success float-right" v-on:click="sendRatingAndComment(movie.imdbID, movie.Title)" :disabled="disabled">Submit</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="ml-5 mr-5">
            <div class="row p-5 text-left justify-content-around">
                <div class="col-4 shadow p-4 mb-4 bg-white rounded">
                    <h2 class="text-center">Description</h2>
                    {{movie.Plot}}
                </div>

                <div class="col-3 shadow p-4 mb-4 bg-white rounded ">
                    <h2 class="text-center">Director And Writers</h2>
                    <span class="font-weight-bold">Director:</span> {{movie.Director}} <br><br>
                    <span class="font-weight-bold">Writers:</span> {{movie.Writer}}
                </div>

                <div class="col-4 shadow p-4 mb-4 bg-white rounded">
                    <h2 class="text-center">Cast</h2>
                    <span class="font-weight-bold">Actors:</span> {{movie.Actors}}
                </div>
            </div>

            <h1 class="text-center pt-1 pb-4">Ratings</h1>

            <div class="row justify-content-around">
                <div class="col-3 shadow p-4 mb-4 ml-1" v-for="rating of ratingList" v-bind:key="rating.Value" >
                    <h2 >{{rating.Source}}</h2><br>
                    {{ rating.Value }}
                </div>
            </div>
        </div>

        <div class="container">
            <h2 class="text-center pt-5 pb-4">Comments</h2>
            <hr style="border: 3px solid cornflowerblue">

            <div class="row justify-content-around">
                <div class="card m-3 col-3 rounded-lg border-info" v-for="comment of commentsList" v-bind:key="comment._hashCode" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">{{comment.userEmail}}</h5>
                        <hr>
                        <h6 class="card-subtitle mb-2 text-muted"></h6>
                        <p class="card-text text-left">{{ comment.comment}}</p>
                        <div class="float-left">
                            <div class="font-weight-bold">Rating: <span>{{ comment.score }} </span>

                                <icon name="star" width="20px" height="20px" class="checked pb-1"></icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="text-center">
        <h1>Sorry there is no {{this.name}} movie in our database</h1>
        <button class="btn btn-info" v-on:click="goBack">Go back</button>
    </div>

</template>


<script>
    import axios from 'axios';

    export default {
        name: 'Movie',
        data() {
            return {
                movie: Object,
                ratingList: [],
                commentsList: [],
                comment: null,
                rating: 1,
                disabled: true,
                id: "",
                name: "",
                response: "",
                isReady: false,
                singlePost: null
            }
        },

        methods: {
                checkForm: function () {
                    let flag = true;
                    console.log(this.comment);
                    console.log(this.rating);
                    if (this.comment == null || this.comment.length === 0) {
                        flag = false;
                    }

                    if (this.rating < 1 || this.rating > 10) {
                        flag = false;
                    }

                    this.disabled = !flag;
                },

                async sendRatingAndComment(imdbID, title) {
                    console.log("This is the rating  " + this.rating);
                    console.log("This is the comment  " + this.comment);
                    console.log("This is the imdbID  " + imdbID);
                    console.log("This is the title  " + title);

                    let postBody = {
                        score: this.rating,
                        comment: this.comment,
                        imdbId: imdbID,
                        movieName: title,
                    };

                    console.log("This is the postBody" + postBody);

                    axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;
                    axios.post(`http://localhost:8765/reviews-service/api/v1/reviews/new`,  {withCredentials: true,
                        score: this.rating,
                        comment: this.comment,
                        imdbId: imdbID,
                        movieName: title
                    })
                        .then(response => {
                            this.commentsList.push(response.data.data)
                        });

                },
            
                goBack: function () {
                    this.$router.push('/');
                },

                async addToFavorites(imdbID) {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;


                    axios.post(`http://localhost:8765/lists-service/api/v1/lists/Favourites/add/imdbId/` + imdbID,  {withCredentials: true })
                        .then(response => {
                            this.response = response.data.data
                        });


                }

        },

        // Fetches posts when the component is created.
        async created() {
            this.id = this.$route.params.id;
            this.name = this.$route.params.name;

            console.log(this.id);
            console.log(this.name);

            let url="";

            if(this.id === 0){
                url = "http://localhost:8765/movies-service/api/v1/movies/name=" + this.name;
            }else{
                url = "http://localhost:8765/movies-service/api/v1/movies/imdbId/" + this.id;
            }


            console.log(url);

            axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;

            axios.get(url, {withCredentials: true})
                .then(response => {
                    // JSON responses are automatically parsed.
                    this.movie = response.data.data;
                    this.ratingList = this.movie.Ratings;
                    this.response = response.data
                });


            axios.get('http://localhost:8765/reviews-service/api/v1/reviews/movieName/' + this.name, {withCredentials: true})
                .then(response => {
                    this.commentsList = response.data.data
                });

            this.isReady = true;
        }

    }


</script>

<style>
    h1, h2, h3{
        color: cornflowerblue;
    }

    hr{
        border: 3px solid cornflowerblue;
        border-radius: 3px;
    }

    .checked{
        color: orange
    }

    .card{
        border: 1px solid cornflowerblue;
    }
</style>