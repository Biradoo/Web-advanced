<script>
    import {createEventDispatcher} from 'svelte';
    import {authStore} from "../stores/authStore.js";

    export let auction;
    let bidAmount = 0;
    let errorMessage = '';
    let user;
    let token;
    let isAdmin = false;
    const dispatch = createEventDispatcher();


    authStore.subscribe(state => {
        user = state.user;
        token = localStorage.getItem('token');

        if (user && user.roles && user.roles.includes('admin')) {
            isAdmin = true;
        }
    });

    async function placeBid() {
        if (!token) {
            errorMessage = 'You need to log in to place a bid.';
            return;
        }

        if (bidAmount <= auction.currentPrice) {
            errorMessage = 'Bid must be higher than the current price.';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/auctions/${auction.id}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: bidAmount,
                    user: user
                })
            });

            const data = await response.json();
            dispatch('bid', {amount: bidAmount, user: user.username, timestamp: new Date().toISOString()});
            if (!response.ok) {
                throw new Error(data.message || 'Failed to place bid');
            }
        } catch (err) {
        }
    }
</script>

<div class="bid-form">
    {#if !isAdmin}
        <h3>Place a Bid</h3>
        <input type="number" placeholder="Enter your bid amount" bind:value={bidAmount}/>
        <button on:click={placeBid}>Place Bid</button>
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
    {:else}
        <div role="alert" aria-live="assertive" class="admin-warning">
            Admins are not allowed to place bids.
        </div>
    {/if}
</div>

<style>
    .bid-form {
        margin-top: 20px;
    }

    .bid-form input {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .bid-form button {
        width: 100%;
        padding: 10px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .bid-form .error {
        color: red;
    }

    .admin-warning {
        color: red;
        font-weight: bold;
        margin-top: 10px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
</style>