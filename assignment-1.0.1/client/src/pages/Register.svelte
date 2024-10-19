<script>
    import { onMount } from 'svelte';
    import { authStore, setAuth } from '../stores/authStore.js';
    let username = '';
    let password = '';
    let id = '';
    let confirmPassword = '';
    let errorMessage = '';

    let isAuthenticated = false;
    authStore.subscribe(state => {
        isAuthenticated = state.isAuthenticated;
    });

    onMount(() => { //Redirect to homepage if user is logged in
        if (isAuthenticated) {
            window.location.href = '/';
        }
    });

    async function register() {
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, confirmPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.message || 'Registration failed';
                return;
            }

            setAuth({ username, roles: 'bidder' }, data.token); // Update authStore
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ id: data.username.id, username: data.username.username, roles: data.username.roles }));

            window.location.href = '/';  // Redirect to homepage after successful registration

        } catch (err) {
            errorMessage = err.message;
        }
    }
</script>

<div class="register-container">
    <h2>Register</h2>
    <input type="username" placeholder="Username" bind:value={username} />
    <input type="password" placeholder="Password" bind:value={password} />
    <input type="password" placeholder="Confirm Password" bind:value={confirmPassword} />
    <button on:click={register}>Register</button>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
</div>

<style>
    .register-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .register-container h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .register-container input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .register-container button {
        width: 100%;
        padding: 10px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .register-container button:hover {
        background-color: #2980b9;
    }

    .error {
        color: red;
        text-align: center;
        margin-top: 10px;
    }
</style>