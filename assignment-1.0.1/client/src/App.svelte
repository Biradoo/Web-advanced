<!-- src/App.svelte -->
<script>
    import {Router, Route} from 'svelte-routing';
    import Home from './pages/Home.svelte';
    import Details from './pages/Details.svelte';
    import Login from './pages/Login.svelte';
    import Register from './pages/Register.svelte';
    import Header from './components/Header.svelte';
    import Footer from './components/Footer.svelte';
    import WonAuctions from './pages/WonAuctions.svelte';
    import AddAuction from "./pages/AddAuction.svelte";
    import EditAuction from './pages/EditAuction.svelte';
    import {onMount} from 'svelte';
    import {initializeAuth, setAuth} from './stores/authStore.js';

    onMount(() => {
        initializeAuth();
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            setAuth(JSON.parse(user), token); //Restore authentication state
        }
    });

</script>
<div class="app">
    <Header/>

    <div class="container">
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/auctions/:id" component={Details}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/won-auctions" component={WonAuctions}/>
            <Route path="/add" component="{AddAuction}"/>
            <Route path="/auctions/:id/edit" component={EditAuction}/>
        </Router>
    </div>
    <Footer/>
</div>

<style>
    /* Global styles */
    .container {
        max-width: 100%;
        margin: 0 auto;
        padding: 0 20px;
    }
</style>