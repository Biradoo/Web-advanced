<script>
    import {onMount} from 'svelte';
    import BidForm from '../components/BidForm.svelte';
    import Countdown from '../components/Countdown.svelte';
    import {authStore} from "../stores/authStore.js";

    export let id;
    let auction = null;
    let successMessage = '';
    let errorMessage = '';
    let isAuctionEnded = false;

    let user = null;
    let isAuthenticated = false;

    authStore.subscribe(state => {
        user = state.user;
        isAuthenticated = state.isAuthenticated;
    });

    onMount(async () => { //Even though error, this works as intended
        //Set up the EventSource for real-time updates
        const eventSource = new EventSource(`http://localhost:3000/api/auctions/stream`);
        eventSource.onmessage = (event) => {
            const updatedAuction = JSON.parse(event.data);
            if (updatedAuction.id === id) {
                auction = {...updatedAuction};
            }
        };
        await fetchAuctionDetails();
        return () => {
            eventSource.close();
        };
    });
    async function fetchAuctionDetails() {
        try {
            const response = await fetch(`http://localhost:3000/api/auctions/${id}`);
            auction = await response.json();
            checkIfAuctionEnded();
        } catch (err) {
            errorMessage = 'Failed to fetch auction details';
        }
    }
    function checkIfAuctionEnded() {
        if (auction && auction.endDate) {
            isAuctionEnded = new Date(auction.endDate) <= new Date();
        }
    }

    function handleBid(event) { //Handle bid from the BidForm
        auction.bids.push(event.detail);
        auction.currentPrice = event.detail.amount;
        successMessage = 'Bid placed successfully!';
        clearMessages();
    }

    async function handleDelete() {
        const confirmDelete = confirm("Are you sure you want to delete this auction?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    alert("Auction deleted successfully!");
                    window.location.href = '/'; //Redirect to homepage
                }
            } catch (err) {
                console.error("Error deleting auction:", err);
            }
        }
    }

    function clearMessages() {
        setTimeout(() => {
            successMessage = '';
            errorMessage = '';
        }, 2000);
    }

</script>
{#if auction}
    <article class="details-container">

        <figure>
            <img src={auction.attributes.image} alt={`${auction.attributes.pokemon} image`}/>
        </figure>

        <section class="details-content">

            <header>
                <h1>{auction.attributes.pokemon} - {auction.attributes.set}</h1>
            </header>

            <section class="auction-info">
                <p><strong>Grade:</strong> {auction.attributes.grade}</p>
                <p><strong>Grading Company:</strong> {auction.attributes.gradingCompany}</p>
                <p><strong>Year:</strong> {auction.attributes.year}</p>
                <p><strong>Holo:</strong> {auction.attributes.holo}</p>
                <p><strong>Price:</strong> ${auction.currentPrice}</p>
                <p><strong>End Date:</strong> {new Date(auction.endDate).toLocaleString()}</p>
                <Countdown endDate={auction.endDate} />
            </section>

            <aside class="bids-section">
                <h3>Current Bids</h3>
                <ul>
                    {#each auction.bids as bid}
                        <li>{bid.user} bid ${bid.amount} on {new Date(bid.timestamp).toLocaleString()}</li>
                    {/each}
                </ul>
            </aside>

        </section>

        {#if user && user.roles.includes('admin')}

            <div class="admin-actions">
                <button type="button" on:click={() => window.location.href = `/auctions/${id}/edit`}>Edit</button>
                <button type="button" class="delete-btn" on:click={handleDelete}>Delete</button>
            </div>
        {/if}

    </article>

    {#if !isAuctionEnded}
        <footer class="bid-section">
            <BidForm {auction} on:bid={handleBid} />
        </footer>
    {/if}
    {#if successMessage}
        <p class="success">{successMessage}</p>
    {/if}
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
{:else}
    <p>Loading auction details...</p>
{/if}


<style>
    .details-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        position: relative;
    }

    .admin-actions {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    button {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        background-color: #3498db;
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #2980b9;
    }

    .delete-btn {
        background-color: #e74c3c;
    }

    .delete-btn:hover {
        background-color: #c0392b;
    }

    figure {
        flex: 1 1 300px;
        margin: 0;
        padding: 0;
        max-width: 300px;
    }

    img {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }

    .details-content {
        flex: 2;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .error {
       color: red;
    }

    .success {
        color: green;
    }
</style>