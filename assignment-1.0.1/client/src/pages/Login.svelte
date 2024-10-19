<script>
    import {setAuth} from "../stores/authStore.js";

    let username = '';
    let password = '';
    let errorMessage = '';

    async function handleLogin() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.message || 'Login failed';
                return;
            }

            setAuth({ id: data.id, username: data.username, roles: data.roles }, data.token);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username, roles: data.roles }));

            window.location.href = '/';
        } catch (error) {
            errorMessage = 'Login failed. Please try again.';
            console.error('Login Error:', error);
        }
    }
</script>

<div class="login-container">
    <h2>Login</h2>
    <input type="username" placeholder="Username" bind:value={username}/>
    <input type="password" placeholder="Password" bind:value={password}/>
    <button on:click={handleLogin}>Login</button>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
</div>

<style>
    .login-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .login-container h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
        font-size: 24px;
    }

    .login-container input {
        width: 100%;
        padding: 12px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
        background-color: #fff;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        outline: none;
        box-sizing: border-box;
    }

    .login-container button {
        width: 100%;
        padding: 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }

    .login-container button:hover {
        background-color: #2980b9;
    }

    .error {
        color: red;
        margin-top: 10px;
        text-align: center;
    }

    input[type="password"] {
        margin-bottom: 20px;
    }
</style>