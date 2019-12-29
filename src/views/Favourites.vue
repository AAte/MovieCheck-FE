<template>
  <div class="text-center">
    <div class="row" id="heading1">
      <div class="col-4 p-4">
        <hr>
      </div>
      <div class="col-4">
        <h1 class="p-4 font-weight-bold" style="color: cornflowerblue">List of favorite movies</h1>
      </div>
      <div class="col-4 p-4">
        <hr>
      </div>
    </div>

    <div class="container" v-if="favoriteMovies.length !== 0">
      <div class="row">
        <div class="col-4 pt-5"  v-for="favorite in favoriteMovies" v-bind:key="favorite.imdbID">
          <div class="card">
            <img v-bind:src="favorite.Poster" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ favorite.Title }}</h5>
              <p class="card-text text-left"> {{ favorite.Plot.substring(0,110)}} ...</p>
              <div class="row">

                <div class="col-6">
                  <router-link class="btn btn-success" :to="{name: 'Movie', params: { id: favorite.imdbID, name: favorite.Title }}">Movie details</router-link>
                </div>

                <div class="col-6">

                  <button class="btn btn-danger" v-on:click="removeFromFavorites(favorite.imdbID)">Remove</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container">
      <h2 class="text-center font-weight-bold" style="color:gray">No favourite movies</h2>
    </div>



  </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "favorites",
        data() {
            return {
                favoriteMovies:  [],
                response: null,
            };
        },
        methods: {
            async removeFromFavorites(imdbID) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;

                axios.delete(`http://localhost:8765/lists-service/api/v1/lists/Favourites/delete/imdbId/` + imdbID,  {withCredentials: true })
                    .then(response => {
                        this.favoriteMovies = response.data.data.movies;
                    });

            }
        },

        async created() {

            axios.defaults.headers.common["Authorization"] = `Bearer ${await this.$auth.getAccessToken()}`;

            axios.get(`http://localhost:8765/lists-service/api/v1/lists/Favourites`, {withCredentials: true })
                .then(response => {
                    // JSON responses are automatically parsed.
                    this.favoriteMovies = response.data.data.movies
                })



        }
    }
</script>

<style>
  .card{
    border: 1px solid cornflowerblue;
  }
</style>
