<template>
  <div>
   <nav class="navbar navbar-expand-sm bg-dark">

        <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2"  >
              <!-- Brand -->
              <a class="navbar-brand" href="#">TheSquad</a>

              <!-- Links -->
              <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/favourites">Favorites</router-link>
                </li>

                <li class="nav-item">
                    <form class="form-inline ml-3" action="">
                        <input class="form-control mr-sm-2" type="text" v-model="searchTitle" v-on:change="updateSearchButton" placeholder="Find a movie">
                        <router-link v-if="!disabled" style="color: darkblue" class="btn bg-white" :to="{name: 'Movie', params: { id: 0,  name: this.searchTitle }}">Search a movie</router-link>
                    </form>
                </li>
              </ul>
        </div>

        <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <button class="btn btn-primary" style="color: darkblue; background-color: white" v-if="authenticated" v-on:click="logout" id="logout-button">
                        Logout
                    </button>
                    <button class="btn btn-primary" style="color: darkblue; background-color: white" v-else v-on:click="login" id="login-button">Login</button>
                </li>
            </ul>
        </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>

    export default {
        name: "App",
        data: function() {
            return {
                searchTitle: null,
                authenticated: false,
                disabled: true
            };
        },
        created() {
            this.isAuthenticated();
        },
        watch: {
            // Everytime the route changes, check for auth status
            $route: "isAuthenticated"
        },
        methods: {
            async isAuthenticated() {
                this.authenticated = await this.$auth.isAuthenticated();
            },
            login() {
                this.$auth.loginRedirect("/");
            },
            async logout() {
                await this.$auth.logout();
                await this.isAuthenticated();

                // Navigate back to home
                this.$router.push({ path: "/" });
            },
            updateSearchButton: function () {
                let flag = true;
                if (this.searchTitle == null || this.searchTitle.length === 0) {
                    flag = false;
                }

                this.disabled = !flag;
            }
        }
    };

</script>

<style>
    .navbar {
        background-color: aqua;
    }

    .nav-link {
        color: gray;
    }
</style>