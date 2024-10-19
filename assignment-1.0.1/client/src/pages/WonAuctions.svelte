<script>
    import { authStore } from '../stores/authStore.js';
    import Card from "../components/Card.svelte";
    import {onMount} from "svelte";

    let user;
    let token;


    authStore.subscribe(state => { //Subscribe to authStore to get current user and token
        user = state.user;
        token = localStorage.getItem('token');
    });

    let wonAuctions = [];
    let matchedAuctions = [];
    let totalAmountDue = 0;
    let errorMessage = '';

    async function fetchWonAuctions() { //Fetch won auctions for authenticated user
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/users/${user.id}/won-auctions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                wonAuctions = data.wonAuctions;
                totalAmountDue = data.totalAmountDue;
                await fetchAuctionDetailsForWonAuctions();

            } else {
                console.error('Failed to fetch won auctions:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching won auctions:', error);
            errorMessage = 'Failed to fetch won auctions.';
        }
    }

    async function fetchAuctionDetailsForWonAuctions() {
        const auctionDetailsPromises = wonAuctions.map(async won => {
            const response = await fetch(`http://localhost:3000/api/auctions/${won.auctionId}`);
            const auction = await response.json();

            if (response.ok) {
                return {
                    ...auction,
                    currentPrice: won.price,
                    wonAt: won.wonAt
                };
            }
            return null;
        });
        matchedAuctions = (await Promise.all(auctionDetailsPromises)).filter(Boolean);
    }

    onMount(fetchWonAuctions);

</script>

{#if matchedAuctions.length > 0}
    <section class="won-auctions-container">
        <h2>Won Auctions</h2>

        <div class="auction-list">
            {#each matchedAuctions as auction}
                <Card {auction} />
            {/each}
        </div>

        <div class="total-amount">
            <p><strong>Total Amount Due: ${totalAmountDue}</strong></p>
        </div>
    </section>
{:else}
    <p>You haven't won any auctions yet.</p>
{/if}

<style>
    .won-auctions-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .auction-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .total-amount {
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #333;
        text-align: right;
    }
</style>