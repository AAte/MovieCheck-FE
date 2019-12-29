<template>
  <div>
    <div class="row" id="heading1">
      <div class="col-4 p-4">
        <hr>
      </div>
      <div class="col-4">
        <h1 class="p-4 font-weight-bold text-center" style="color: cornflowerblue">List of all movies</h1>
      </div>
      <div class="col-4 p-4">
        <hr>
      </div>
    </div>

    <div class="container text-center">
      <div class="row">
        <div class="col-4 pt-5" v-for="movie in movies" v-bind:key="movie.imdbID">
          <div class="card">
            <img v-bind:src="movie.Poster" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ movie.Title }}</h5>
              <p class="card-text text-left"> {{ movie.Plot.substring(0,110)}} ...</p>
              <div class="row">

                <div class="col-6">
                  <router-link class="btn btn-success" :to="{name: 'Movie', params: { id: movie.imdbID, name: movie.Title }}">Movie details</router-link>
                </div>

                <div class="col-6">

                  <button class="btn border-primary" v-on:click="addToFavorites(movie.imdbID)">Add to favorites</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    import axios from 'axios';

export default {
  name: 'home',
  data() {
      return {
          movies: [],
          response: null
      };
  },
    methods: {
        async addToFavorites(imdbID) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;


            axios.post(`http://localhost:8765/lists-service/api/v1/lists/Favourites/add/imdbId/` + imdbID,  {withCredentials: true })
                .then(response => {
                    this.response = response.data.data
                });


        }
    },

    async created() {

        axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;

        axios.get(`http://localhost:8765/movies-service/api/v1/movies/`, {withCredentials: true })
            .then(response => {
                // JSON responses are automatically parsed.
                this.movies = response.data.data
            })


    }


}
</script>

<style>
  .card{
    border: 1px solid cornflowerblue;
  }
</style>
