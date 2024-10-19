<script>
    import {authStore, clearAuth, initializeAuth} from '../stores/authStore.js';

    initializeAuth();

    let user = null;
    let isAuthenticated = false;
    let showDropdown = false;

    authStore.subscribe(state => {
        user = state.user;
        isAuthenticated = state.isAuthenticated;
    });

    function handleLogout() {
        clearAuth(); //Clear auth data in the store
        localStorage.removeItem('token'); //Clear localStorage
        localStorage.removeItem('user');
        window.location.href = '/'; //Redirect to homepage after logout
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

</script>

<header class="header">
    <div>
        <h1><a href="/" class="title-link">Pokemon Card Auctions</a></h1>
        <p>Welcome to the greatest Graded Pokemon Cards of all time!</p>
    </div>

    <nav>
        <button class="profile-container" on:click={toggleDropdown}>

            <div class="profile-icon">{isAuthenticated ? user.username.charAt(0).toUpperCase() : 'P'}</div>
        </button>

        {#if showDropdown}
            <div class="dropdown show">
                {#if isAuthenticated}
                    <div class="auth-links">
                        <ul>
                            <li><p class="welcome">Welcome, {user.username}!</p></li>
                            {#if user.roles.includes('admin')}
                                <li><a href="/add">Add Auction</a></li>
                            {/if}

                            {#if user.roles.includes('bidder')}
                            <li><a href="/won-auctions">Won Auctions</a></li>
                            {/if}
                            <li><button on:click={handleLogout} class="auth-button">Logout</button></li>
                        </ul>
                    </div>
                {:else}
                    <div class="auth-links">
                        <ul>
                            <li><button on:click={() => window.location.href = '/login'} class="auth-button">Login</button></li>
                            <li><button on:click={() => window.location.href = '/register'} class="auth-button">Register</button></li>
                        </ul>
                    </div>
                {/if}
            </div>
        {/if}
    </nav>
</header>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: #f8f8f8;
        border-bottom: 1px solid #ddd;
        margin-bottom: 15px;
    }

    .header h1 {
        margin: 0;
        font-size: 24px;
        color: #333;
    }

    .header p {
        margin: 0;
        font-size: 14px;
        color: #666;
    }

    .profile-container {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-left: 20px;
    }

    .profile-icon {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #3498db;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: white;
    }

    .dropdown {
        position: absolute;
        top: 75px;
        right: 10px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: none;
        z-index: 100;
        width: 150px;
    }

    .dropdown.show {
        display: block;
    }


    .auth-links ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .auth-links li {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .auth-links li button,
    .auth-links li a {
        display: block;
        width: 100%;
        padding: 10px;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: #3498db;
        transition: background-color 0.3s ease;
    }

    .auth-links li a {
        text-decoration: none;
        color: inherit;
    }

    .auth-links li a:hover,
    .auth-links li button:hover {
        background-color: #f1f1f1;
    }

    .welcome {
        color: black;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: left;
        padding-left: 10px;
    }

</style>